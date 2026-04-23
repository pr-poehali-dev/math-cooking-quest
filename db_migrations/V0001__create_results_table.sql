
CREATE TABLE t_p57235743_math_cooking_quest.results (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
