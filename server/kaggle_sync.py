import os
import sys
import json
import csv
from datetime import datetime

try:
    import kaggle
    from kaggle.api.kaggle_api_extended import KaggleApi
except ImportError:
    print(json.dumps({"success": False, "message": "Kaggle package not installed. Run: pip install kaggle"}))
    sys.exit(1)

def run_sync():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    db_file = os.path.join(data_dir, "contest_db.json")
    export_dir = os.path.join(data_dir, "kaggle_export")

    if not os.path.exists(db_file):
        print(json.dumps({"success": False, "message": "contest_db.json not found."}))
        sys.exit(1)

    os.makedirs(export_dir, exist_ok=True)

    with open(db_file, "r", encoding="utf-8") as f:
        db = json.load(f)

    # 1. Authenticate with Kaggle
    try:
        api = KaggleApi()
        api.authenticate()
        username = api.get_config_value("username") or "tsaiteja2008"
    except Exception as e:
        print(json.dumps({"success": False, "message": f"Kaggle authentication failed: {str(e)}"}))
        sys.exit(1)

    dataset_slug = "nptel-metal-additive-manufacturing-results"
    dataset_title = "NPTEL - Metal Additive Manufacturing Examination Results"

    # 2. Export Leaderboard CSV
    attempts = list(db.get("attempts", {}).values())
    valid_attempts = [a for a in attempts if a.get("status") != "RESET"]
    valid_attempts.sort(key=lambda a: (-float(a.get("score", 0)), float(a.get("time_taken_seconds", 999999))))

    leaderboard_csv = os.path.join(export_dir, "leaderboard_rankings.csv")
    with open(leaderboard_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Rank", "Roll_Number", "Student_Name", "Department", "Year", "Section",
            "Score_Out_Of_40", "Percentage", "Correct_Count", "Incorrect_Count",
            "Unanswered_Count", "Time_Taken_Seconds", "Time_Formatted", "Status",
            "Submitted_At", "Tab_Switches"
        ])
        for idx, att in enumerate(valid_attempts):
            roll = att.get("roll_number", "")
            reg = db.get("registrations", {}).get(roll, {})
            score = att.get("score", 0)
            time_sec = att.get("time_taken_seconds", 0)
            time_fmt = f"{time_sec // 60:02d}:{time_sec % 60:02d}"
            pct = round((score / 40.0) * 100, 1)
            writer.writerow([
                idx + 1,
                roll,
                reg.get("student_name", att.get("student_name", "Student")),
                reg.get("department", "Mechanical Engineering"),
                reg.get("year", "3rd Year"),
                reg.get("section", "A"),
                score,
                f"{pct}%",
                att.get("correct_count", 0),
                att.get("incorrect_count", 0),
                att.get("unanswered_count", 0),
                time_sec,
                time_fmt,
                att.get("status", ""),
                att.get("submitted_at", ""),
                att.get("tab_switch_count", 0)
            ])

    # 3. Export Candidate Submissions & Answers CSV
    submissions_csv = os.path.join(export_dir, "candidate_itemized_responses.csv")
    with open(submissions_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Roll_Number", "Student_Name", "Question_ID", "Candidate_Answer",
            "Assigned_Sequence_Number", "Submission_Time"
        ])
        for att in valid_attempts:
            roll = att.get("roll_number", "")
            name = att.get("student_name", "")
            answers = att.get("answers", {})
            assigned = att.get("assigned_question_ids", [])
            for q_idx, q_id in enumerate(assigned):
                ans = answers.get(q_id, "UNANSWERED")
                writer.writerow([
                    roll, name, q_id, ans, q_idx + 1, att.get("submitted_at", "")
                ])

    # 4. Export Registrations Roster CSV
    roster_csv = os.path.join(export_dir, "registered_candidates_roster.csv")
    with open(roster_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Roll_Number", "Student_Name", "Department", "Year", "Section", "Status", "Registered_At"])
        for reg in db.get("registrations", {}).values():
            writer.writerow([
                reg.get("roll_number"),
                reg.get("student_name"),
                reg.get("department"),
                reg.get("year"),
                reg.get("section"),
                reg.get("status"),
                reg.get("registration_time")
            ])

    # 5. Export Audit Logs CSV
    audit_csv = os.path.join(export_dir, "audit_security_trail.csv")
    with open(audit_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Log_ID", "Timestamp", "Event_Type", "Roll_Number", "Attempt_ID", "Details"])
        for log in db.get("audit_logs", []):
            writer.writerow([
                log.get("id"),
                log.get("timestamp"),
                log.get("event_type"),
                log.get("roll_number", ""),
                log.get("attempt_id", ""),
                log.get("details")
            ])

    # 6. Copy Raw JSON State
    raw_json_copy = os.path.join(export_dir, "full_contest_db.json")
    with open(raw_json_copy, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

    # 7. Write dataset-metadata.json for Kaggle
    metadata = {
        "title": dataset_title,
        "id": f"{username}/{dataset_slug}",
        "licenses": [{"name": "CC0-1.0"}],
        "description": "Comprehensive diagnostic examination results, itemized responses, audit logs, and performance metrics for NPTEL - Metal Additive Manufacturing."
    }
    with open(os.path.join(export_dir, "dataset-metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    # 8. Upload / Create Dataset on Kaggle
    version_message = f"Exam Data Backup Snapshot: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    dataset_url = f"https://www.kaggle.com/datasets/{username}/{dataset_slug}"

    try:
        datasets = api.dataset_list(user=username)
        dataset_exists = any(d.ref == f"{username}/{dataset_slug}" for d in datasets)

        if dataset_exists:
            api.dataset_create_version(
                folder=export_dir,
                version_notes=version_message,
                dir_mode="zip",
                quiet=False
            )
            action = "UPDATED"
        else:
            api.dataset_create_new(
                folder=export_dir,
                dir_mode="zip",
                public=False,
                quiet=False
            )
            action = "CREATED"

        result = {
            "success": True,
            "action": action,
            "message": f"Successfully backed up and synced all exam data to Kaggle ({action}).",
            "dataset_url": dataset_url,
            "username": username,
            "slug": dataset_slug,
            "files_synced": [
                "leaderboard_rankings.csv",
                "candidate_itemized_responses.csv",
                "registered_candidates_roster.csv",
                "audit_security_trail.csv",
                "full_contest_db.json"
            ],
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Kaggle Dataset sync error: {str(e)}",
            "dataset_url": dataset_url,
            "local_backup_ready": True
        }))

if __name__ == "__main__":
    run_sync()
