import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает все результаты класса для учителя"""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("""
        SELECT id, student_name, score, mistakes, duration_seconds, answers, created_at
        FROM t_p57235743_math_cooking_quest.results
        ORDER BY created_at DESC
        LIMIT 200
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "student_name": row[1],
            "score": row[2],
            "mistakes": row[3],
            "duration_seconds": row[4],
            "answers": row[5] if isinstance(row[5], list) else [],
            "created_at": row[6].isoformat() if row[6] else None,
        })

    return {"statusCode": 200, "headers": headers, "body": json.dumps({"results": results}, ensure_ascii=False)}
