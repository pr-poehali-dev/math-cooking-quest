import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет результат прохождения квеста учеником"""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
        student_name = body.get("student_name", "").strip()
        score = int(body.get("score", 0))
        mistakes = int(body.get("mistakes", 0))
        duration_seconds = int(body.get("duration_seconds", 0))
        answers = body.get("answers", [])

        if not student_name:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Укажи имя"})}

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO t_p57235743_math_cooking_quest.results (student_name, score, mistakes, duration_seconds, answers) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (student_name, score, mistakes, duration_seconds, json.dumps(answers, ensure_ascii=False))
        )
        result_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True, "id": result_id})}
    except Exception as e:
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}
