import http from 'http';

function makeRequest(options: http.RequestOptions, postData?: any): Promise<{ status: number, data: any, headers: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = body;
        try { parsed = JSON.parse(body); } catch(e) {}
        resolve({ status: res.statusCode || 0, data: parsed, headers: res.headers });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('--- STARTING COMPREHENSIVE NPTEL EXAM AUDIT & TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  }

  try {
    // 0. Clean Initial State
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/purge',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-host-key': '738637' }
    }, { passkey: '738637' });

    // 1. Contest Info Check
    const info = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/info',
      method: 'GET'
    });
    assert(info.status === 200, 'GET /api/contest/info responds 200');
    assert(info.data.contest.title.includes('NPTEL'), 'Title is official NPTEL exam');

    // 2. Reject Unauthorized Student
    const unauth = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { roll_number: '24A31A9999' });
    assert(unauth.status === 403, 'Unauthorized roll number 24A31A9999 rejected with 403');
    assert(unauth.data.success === false, 'Unauthorized response has success: false');

    // 3. Reject Public Student List / Registration enumeration
    const enumAttempt = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/registration/24A31A0301',
      method: 'GET'
    });
    assert(enumAttempt.status === 401, 'Public student enumeration /api/registration/:roll rejected with 401');

    // 4. Valid Student Login & Exam Start (Student 1)
    const s1Start = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { roll_number: '24A31A0301' });
    assert(s1Start.status === 200, 'Valid student 24A31A0301 starts attempt with 200');
    assert(s1Start.data.success === true, 'Student 1 attempt successfully initialized');
    const attempt1Id = s1Start.data.attempt?.attempt_id || s1Start.data.attempt_id;

    // 5. Valid Student Login & Exam Start (Student 2)
    const s2Start = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { roll_number: '24A31A0302' });
    assert(s2Start.status === 200, 'Valid student 24A31A0302 starts attempt with 200');
    const attempt2Id = s2Start.data.attempt?.attempt_id || s2Start.data.attempt_id;

    // 6. Inspect Session Questions for Student 1
    const s1Session = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/contest/session/${attempt1Id}`,
      method: 'GET'
    });
    assert(s1Session.status === 200, 'Student 1 fetches active session');
    assert(s1Session.data.questions.length === 40, 'Exactly 40 questions returned in session');
    
    // Check question and option security
    const leakedAnswers = s1Session.data.questions.filter((q: any) => q.correct_option_id !== undefined || q.correct_display_id !== undefined);
    assert(leakedAnswers.length === 0, 'No correct answers leaked in public question payload');

    // 7. Verify Question & Option Shuffling Randomization between Student 1 and Student 2
    const s2Session = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/contest/session/${attempt2Id}`,
      method: 'GET'
    });
    assert(s2Session.data.questions.length === 40, 'Student 2 also has exactly 40 questions');

    const s1Order = s1Session.data.questions.map((q: any) => q.id).join(',');
    const s2Order = s2Session.data.questions.map((q: any) => q.id).join(',');
    assert(s1Order !== s2Order, 'Question sequence is uniquely shuffled per candidate');

    // 8. Test Answer Auto-Save & Scoring Logic
    // Host dashboard before submit
    const hostData1 = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/dashboard',
      method: 'GET',
      headers: { 'x-host-key': '738637' }
    });
    assert(hostData1.status === 200, 'Host authenticates with passkey 738637');
    
    // Check answer saving on Question 1 for Student 1
    const q1 = s1Session.data.questions[0];
    const opt1 = q1.options[0].id; // e.g. "A"
    const saveAns = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/save-answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      attempt_id: attempt1Id,
      question_id: q1.id,
      option_id: opt1
    });
    assert(saveAns.status === 200, 'Answer auto-saved successfully');
    assert(saveAns.data.success === true, 'Answer saved confirmed');

    // 9. Submit Student 1 Attempt
    const sub1 = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt1Id });
    assert(sub1.status === 200, 'Student 1 submission completed');

    // 10. Verify Host Privileged Results Access & Marking Scheme (+1.0 Correct, -0.5 Incorrect)
    const hostDashboard = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/dashboard',
      method: 'GET',
      headers: { 'x-host-key': '738637' }
    });
    assert(hostDashboard.status === 200, 'Host can view full dashboard');

    // Test specific candidate scoring with Student 2:
    // In student 2's session, let's find the correct answers from host attempt mapping
    const attemptsList = hostDashboard.data.data?.attempts || hostDashboard.data.attempts;
    const s2AttemptFull = attemptsList.find((a: any) => a.roll_number === '24A31A0302');
    assert(s2AttemptFull !== undefined, 'Host can access student 2 attempt record');
    
    // Answer 2 correct questions and 2 wrong questions for student 2
    const qIds = Object.keys(s2AttemptFull.shuffled_options).slice(0, 4);
    // Question 0: answer correct option
    const q0_correct = s2AttemptFull.shuffled_options[qIds[0]].correct_display_id;
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/save-answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt2Id, question_id: qIds[0], option_id: q0_correct });

    // Question 1: answer correct option
    const q1_correct = s2AttemptFull.shuffled_options[qIds[1]].correct_display_id;
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/save-answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt2Id, question_id: qIds[1], option_id: q1_correct });

    // Question 2: answer wrong option
    const q2_wrong = s2AttemptFull.shuffled_options[qIds[2]].correct_display_id === 'A' ? 'B' : 'A';
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/save-answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt2Id, question_id: qIds[2], option_id: q2_wrong });

    // Question 3: answer wrong option
    const q3_wrong = s2AttemptFull.shuffled_options[qIds[3]].correct_display_id === 'A' ? 'B' : 'A';
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/save-answer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt2Id, question_id: qIds[3], option_id: q3_wrong });

    // Submit Student 2
    await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contest/submit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { attempt_id: attempt2Id });

    const hostLeaderboard = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/leaderboard',
      method: 'GET',
      headers: { 'x-host-key': '738637' }
    });
    assert(hostLeaderboard.status === 200, 'Host can view unmasked leaderboard');
    const s2Entry = hostLeaderboard.data.leaderboard.find((e: any) => e.roll_number === '24A31A0302');
    assert(s2Entry !== undefined, 'Student 2 graded and listed in host leaderboard');
    // Expected: 2 correct (+2.0), 2 incorrect (-1.0) = final score 1.0, 36 unanswered (out of 40)
    assert(s2Entry.correct_count === 2, `Student 2 correct count is 2 (got ${s2Entry.correct_count})`);
    assert(s2Entry.incorrect_count === 2, `Student 2 incorrect count is 2 (got ${s2Entry.incorrect_count})`);
    assert(s2Entry.unanswered_count === 36, `Student 2 unanswered count is 36 (got ${s2Entry.unanswered_count})`);
    assert(s2Entry.score === 1.0, `Student 2 score matches exact (+1.0 / -0.5) formula: 1.0 (got ${s2Entry.score})`);

    // 11. Verify Public Leaderboard Locking
    const publicLb1 = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/leaderboard',
      method: 'GET'
    });
    assert(publicLb1.data.results_released === false, 'Public leaderboard is initially locked');
    assert(publicLb1.data.leaderboard.length === 0, 'No student ranks visible while locked');

    // 12. Release Results with Host Key
    const releaseRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/results/release',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { passkey: '738637' });
    assert(releaseRes.data.success === true, 'Results released successfully with passkey 738637');

    const publicLb2 = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/leaderboard',
      method: 'GET'
    });
    assert(publicLb2.data.results_released === true, 'Public leaderboard now unlocked');

    // 13. Reset & Purge System for Live Run
    const purge = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/host/purge',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-host-key': '738637' }
    }, { passkey: '738637' });
    assert(purge.data.success === true, 'System successfully purged and reset for live exam');

    console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Audit script exception:', err);
    process.exit(1);
  }
}

runAudit();
