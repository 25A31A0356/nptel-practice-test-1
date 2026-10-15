import { generateQuestionBank } from "./server/question_bank";

const bank = generateQuestionBank();
console.log("==========================================");
console.log("QUESTION BANK VERIFICATION SUMMARY");
console.log("==========================================");
console.log("Total Questions Loaded:", bank.length);

const uniqueIds = new Set(bank.map((q) => q.id));
console.log("Unique Question IDs:", uniqueIds.size);

const papers = {
  "Paper 1 (Week 7)": bank.filter((q) => q.id.startsWith("MAM_W07")),
  "Paper 2 (Week 8)": bank.filter((q) => q.id.startsWith("MAM_W08")),
  "Paper 3 (Week 9)": bank.filter((q) => q.id.startsWith("MAM_W09")),
  "Paper 4 (Week 10)": bank.filter((q) => q.id.startsWith("MAM_W10")),
  "Paper 5 (Week 11)": bank.filter((q) => q.id.startsWith("MAM_W11")),
  "Paper 6 (Week 12)": bank.filter((q) => q.id.startsWith("MAM_W12"))
};

for (const [name, qs] of Object.entries(papers)) {
  console.log(`- ${name}: ${qs.length} questions`);
}

let errors = 0;
bank.forEach((q, idx) => {
  if (!q.id || !q.title || !q.description || !q.options || q.options.length < 2 || !q.correct_option_id) {
    console.error(`Invalid question at index ${idx}:`, q.id);
    errors++;
  }
  const hasCorrect = q.options.some((opt) => opt.id === q.correct_option_id);
  if (!hasCorrect) {
    console.error(`Correct option ID ${q.correct_option_id} not in options for:`, q.id);
    errors++;
  }
});

console.log("Validation Errors:", errors);
console.log("==========================================");
