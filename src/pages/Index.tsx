import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const SAVE_URL = "https://functions.poehali.dev/a225f95e-b93b-4a13-982f-40120e0638aa";
const GET_URL = "https://functions.poehali.dev/7def573b-6ee3-43d0-b670-1a0ce71c9eea";

// ─── Типы ────────────────────────────────────────────────────────────────────

type QuestionType = {
  id: number;
  subject: "math" | "chemistry" | "physics" | "cooking";
  subjectLabel: string;
  subjectIcon: string;
  question: string;
  hint: string;
  formula: string;
  options: string[];
  correct: number;
  explanation: string;
  ingredient: string;
  ingredientEmoji: string;
};

type AnswerRecord = {
  question_id: number;
  correct: boolean;
  selected: number;
};

type ResultRow = {
  id: number;
  student_name: string;
  score: number;
  mistakes: number;
  duration_seconds: number;
  answers: AnswerRecord[];
  created_at: string;
};

// ─── Данные ──────────────────────────────────────────────────────────────────

const QUESTIONS: QuestionType[] = [
  {
    id: 1,
    subject: "math",
    subjectLabel: "Математика",
    subjectIcon: "Calculator",
    question: "Рецепт требует 3/4 стакана муки. У тебя есть 2 стакана. Сколько раз можно приготовить блюдо?",
    hint: "Раздели общее количество на порцию",
    formula: "Количество = 2 ÷ (3/4) = 2 × 4/3",
    options: ["2 раза", "2,5 раза", "2 целых и ещё ⅔ раза", "3 раза"],
    correct: 2,
    explanation: "2 ÷ 3/4 = 2 × 4/3 = 8/3 ≈ 2,67. Полностью можно приготовить 2 раза, и ещё останется ⅔ порции.",
    ingredient: "Мука",
    ingredientEmoji: "🌾",
  },
  {
    id: 2,
    subject: "physics",
    subjectLabel: "Физика",
    subjectIcon: "Thermometer",
    question: "Духовка нагрета до 180°C. Какая это температура в Кельвинах?",
    hint: "Кельвин = Цельсий + 273",
    formula: "T(K) = T(°C) + 273",
    options: ["93 К", "273 К", "453 К", "180 К"],
    correct: 2,
    explanation: "T = 180 + 273 = 453 К. Шкала Кельвина начинается от абсолютного нуля (-273°C), поэтому всегда прибавляем 273.",
    ingredient: "Тепло духовки",
    ingredientEmoji: "🔥",
  },
  {
    id: 3,
    subject: "chemistry",
    subjectLabel: "Химия",
    subjectIcon: "FlaskConical",
    question: "В 100 г куриной грудки содержится 31 г белка. Сколько белка в 250 г?",
    hint: "Составь пропорцию: 100 г → 31 г",
    formula: "x = 31 × 250 ÷ 100",
    options: ["62 г", "77,5 г", "93 г", "55 г"],
    correct: 1,
    explanation: "x = 31 × 250 / 100 = 77,5 г белка. Пропорции — главный инструмент в кулинарии и химии!",
    ingredient: "Куриная грудка",
    ingredientEmoji: "🍗",
  },
  {
    id: 4,
    subject: "cooking",
    subjectLabel: "Кулинария",
    subjectIcon: "ChefHat",
    question: "Тесто нужно выпекать 40 минут при 180°C. Ты поставил в 14:25. Когда достать?",
    hint: "Прибавь 40 минут к времени начала",
    formula: "14:25 + 0:40 = ?",
    options: ["14:55", "15:05", "15:15", "15:00"],
    correct: 1,
    explanation: "14:25 + 40 минут = 15:05. Всегда ставь таймер — передержанное блюдо уже не спасти!",
    ingredient: "Готовое тесто",
    ingredientEmoji: "🥐",
  },
  {
    id: 5,
    subject: "math",
    subjectLabel: "Математика",
    subjectIcon: "Calculator",
    question: "Рецепт на 4 порции: 200 г сахара. Сколько нужно на 6 порций?",
    hint: "Найди количество на 1 порцию, потом умножь на 6",
    formula: "x = 200 ÷ 4 × 6",
    options: ["240 г", "280 г", "300 г", "320 г"],
    correct: 2,
    explanation: "На 1 порцию: 200 ÷ 4 = 50 г. На 6 порций: 50 × 6 = 300 г. Масштабирование рецептов — чистая математика!",
    ingredient: "Сахар",
    ingredientEmoji: "🍬",
  },
  {
    id: 6,
    subject: "chemistry",
    subjectLabel: "Химия",
    subjectIcon: "FlaskConical",
    question: "В 100 г масла: 0 г белков, 82 г жиров, 0 г углеводов. Сколько калорий? (жир = 9 ккал/г)",
    hint: "Белки и углеводы дают 4 ккал/г, жиры — 9 ккал/г",
    formula: "Ккал = (белки × 4) + (жиры × 9) + (углеводы × 4)",
    options: ["640 ккал", "738 ккал", "800 ккал", "820 ккал"],
    correct: 1,
    explanation: "0×4 + 82×9 + 0×4 = 738 ккал. Именно поэтому масло такое калорийное — в нём почти чистый жир!",
    ingredient: "Сливочное масло",
    ingredientEmoji: "🧈",
  },
];

const RECIPE = {
  title: "Французские круассаны",
  emoji: "🥐",
  steps: [
    "Смешай 500 г муки, 300 г сливочного масла, 7 г соли и 50 г сахара.",
    "Добавь 280 мл тёплого молока (~35°C) и замеси тесто.",
    "Дай тесту подняться 1,5 часа при комнатной температуре.",
    "Раскатай тесто, сформируй круассаны.",
    "Выпекай 40 минут при 180°C (453 К).",
    "В одном круассане: ~6 г белков, ~14 г жиров, ~30 г углеводов = ~270 ккал.",
  ],
  nutrition: [
    { label: "Белки", value: "6 г", icon: "Beef" },
    { label: "Жиры", value: "14 г", icon: "Droplets" },
    { label: "Углеводы", value: "30 г", icon: "Wheat" },
    { label: "Калории", value: "270 ккал", icon: "Flame" },
    { label: "Температура", value: "180°C / 453 К", icon: "Thermometer" },
    { label: "Время", value: "40 мин", icon: "Clock" },
  ],
};

const subjectColors: Record<string, string> = {
  math: "bg-blue-50 border-blue-200",
  physics: "bg-amber-50 border-amber-200",
  chemistry: "bg-green-50 border-green-200",
  cooking: "bg-rose-50 border-rose-200",
};

const subjectBadge: Record<string, string> = {
  math: "bg-blue-100 text-blue-700",
  physics: "bg-amber-100 text-amber-700",
  chemistry: "bg-green-100 text-green-700",
  cooking: "bg-rose-100 text-rose-700",
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m} мин ${sec} сек` : `${sec} сек`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

// ─── Главный компонент ───────────────────────────────────────────────────────

type AppView = "intro" | "quiz" | "result" | "class";

export default function Index() {
  const [view, setView] = useState<AppView>("intro");
  const [studentName, setStudentName] = useState("");
  const [nameError, setNameError] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [collected, setCollected] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [answerLog, setAnswerLog] = useState<AnswerRecord[]>([]);
  const startTime = useRef<number>(0);
  const [saving, setSaving] = useState(false);

  const question = QUESTIONS[current];

  function handleStart() {
    if (!studentName.trim()) {
      setNameError("Введи своё имя, чтобы учитель видел твой результат");
      return;
    }
    setNameError("");
    startTime.current = Date.now();
    setView("quiz");
  }

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === question.correct;
    if (!correct) setMistakes((m) => m + 1);
    else setCollected((prev) => [...prev, question.ingredientEmoji]);
    setAnswerLog((prev) => [...prev, { question_id: question.id, correct, selected: idx }]);
  }

  async function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      setSaving(true);
      try {
        await fetch(SAVE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_name: studentName.trim(),
            score: collected.length + (selected === question.correct ? 0 : 0),
            mistakes,
            duration_seconds: duration,
            answers: [...answerLog],
          }),
        });
      } catch (e) { console.error(e); }
      setSaving(false);
      setView("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCollected([]);
    setMistakes(0);
    setAnswerLog([]);
    setStudentName("");
    setView("intro");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <span className="font-semibold text-foreground text-base">Кулинарная наука</span>
            <div className="text-xs text-muted-foreground">Реши задачи — получи рецепт</div>
          </div>
        </div>
        <button
          onClick={() => setView(view === "class" ? "intro" : "class")}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
            view === "class"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          }`}
        >
          <Icon name="Users" size={15} />
          Класс
        </button>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {view === "intro" && (
            <IntroView
              name={studentName}
              setName={setStudentName}
              nameError={nameError}
              onStart={handleStart}
            />
          )}
          {view === "quiz" && (
            <QuizView
              question={question}
              current={current}
              total={QUESTIONS.length}
              collected={collected}
              selected={selected}
              answered={answered}
              mistakes={mistakes}
              saving={saving}
              onSelect={handleSelect}
              onNext={handleNext}
            />
          )}
          {view === "result" && (
            <ResultView
              studentName={studentName}
              collected={collected}
              mistakes={mistakes}
              duration={Math.round((Date.now() - startTime.current) / 1000)}
              onRestart={handleRestart}
            />
          )}
          {view === "class" && <ClassView />}
        </div>
      </main>
    </div>
  );
}

// ─── Экран ввода имени ───────────────────────────────────────────────────────

function IntroView({ name, setName, nameError, onStart }: {
  name: string; setName: (v: string) => void; nameError: string; onStart: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-6xl mb-5">🍳</div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Стань шеф-поваром</h1>
        <p className="text-muted-foreground leading-relaxed">
          Реши 6 задач по математике, физике, химии и кулинарии.<br />
          За каждый правильный ответ получишь ингредиент.<br />
          Собери все 6 — и получишь настоящий рецепт!
        </p>
      </div>

      {/* Ввод имени */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Как тебя зовут?
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart()}
          placeholder="Например: Иван Иванов"
          className={`w-full px-4 py-3 rounded-xl border text-foreground text-sm outline-none transition-all ${
            nameError ? "border-red-400 bg-red-50" : "border-border bg-background focus:ring-2 focus:ring-ring"
          }`}
          autoFocus
        />
        {nameError && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />
            {nameError}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Учитель увидит твоё имя и результат в таблице класса
        </p>
      </div>

      {/* Предметы */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: "Calculator", label: "Математика", desc: "Пропорции и расчёты", color: "bg-blue-50 border-blue-200" },
          { icon: "Thermometer", label: "Физика", desc: "Температура и время", color: "bg-amber-50 border-amber-200" },
          { icon: "FlaskConical", label: "Химия", desc: "БЖУ и калории", color: "bg-green-50 border-green-200" },
          { icon: "ChefHat", label: "Кулинария", desc: "Техника приготовления", color: "bg-rose-50 border-rose-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
            <Icon name={s.icon} size={20} className="mb-2 text-foreground/60" />
            <div className="text-sm font-semibold text-foreground">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale"
      >
        Начать готовить! 🚀
      </button>
    </div>
  );
}

// ─── Экран квеста ─────────────────────────────────────────────────────────────

function QuizView({ question, current, total, collected, selected, answered, mistakes, saving, onSelect, onNext }: {
  question: QuestionType; current: number; total: number; collected: string[];
  selected: number | null; answered: boolean; mistakes: number; saving: boolean;
  onSelect: (i: number) => void; onNext: () => void;
}) {
  const isCorrect = selected === question.correct;

  return (
    <div className="animate-fade-in">
      {/* Прогресс */}
      <div className="mb-5">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Задача {current + 1} из {total}</span>
          <span>{collected.join(" ")} {collected.length > 0 && `(${collected.length})`}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="progress-bar h-1.5 transition-all duration-500"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex gap-1.5 mt-2.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < current ? "bg-green-400" : i === current ? "bg-amber-400" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Карточка вопроса */}
      <div className={`border rounded-2xl p-5 mb-4 ${subjectColors[question.subject]}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${subjectBadge[question.subject]}`}>
            <Icon name={question.subjectIcon} size={11} />
            {question.subjectLabel}
          </span>
          <span className="text-xs text-muted-foreground">→ {question.ingredientEmoji} {question.ingredient}</span>
        </div>
        <p className="text-foreground font-medium leading-relaxed">{question.question}</p>
        <div className="mt-4 bg-white/60 rounded-xl px-4 py-3 flex items-start gap-2">
          <Icon name="Lightbulb" size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-medium text-foreground mb-0.5">Подсказка</div>
            <div className="text-xs text-muted-foreground">{question.hint}</div>
            <div className="text-xs font-mono text-foreground/60 mt-1">{question.formula}</div>
          </div>
        </div>
      </div>

      {/* Варианты */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((opt, idx) => {
          let cls = "bg-card border border-border text-foreground hover:bg-secondary cursor-pointer";
          if (answered) {
            if (idx === question.correct) cls = "bg-green-50 border-green-400 text-green-800 cursor-default";
            else if (idx === selected) cls = "bg-red-50 border-red-400 text-red-800 cursor-default";
            else cls = "bg-card border border-border text-muted-foreground opacity-50 cursor-default";
          }
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-5 py-3.5 rounded-xl border font-medium text-sm transition-all flex items-center justify-between ${cls}`}
            >
              <span>{opt}</span>
              {answered && idx === question.correct && <Icon name="CheckCircle" size={18} className="text-green-600" />}
              {answered && idx === selected && idx !== question.correct && <Icon name="XCircle" size={18} className="text-red-500" />}
            </button>
          );
        })}
      </div>

      {/* Разбор */}
      {answered && (
        <div className={`rounded-2xl px-5 py-4 mb-4 animate-fade-in ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{isCorrect ? "✅" : "❌"}</span>
            <div>
              <div className={`font-semibold text-sm mb-1 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? `Верно! Ты получаешь: ${question.ingredientEmoji} ${question.ingredient}` : "Неправильно — разберём ошибку"}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{question.explanation}</p>
              {!isCorrect && (
                <div className="mt-2 bg-white/70 rounded-lg px-3 py-2">
                  <div className="text-xs font-medium text-foreground mb-0.5">Правильная формула:</div>
                  <div className="text-xs font-mono text-foreground/70">{question.formula}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {answered && (
        <button
          onClick={onNext}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale animate-fade-in disabled:opacity-60"
        >
          {saving ? "Сохраняем результат..." : current + 1 >= QUESTIONS.length ? "Получить рецепт! 🍽️" : "Следующая задача →"}
        </button>
      )}
    </div>
  );
}

// ─── Экран результата ─────────────────────────────────────────────────────────

function ResultView({ studentName, collected, mistakes, duration, onRestart }: {
  studentName: string; collected: string[]; mistakes: number; duration: number; onRestart: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{RECIPE.emoji}</div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">{RECIPE.title}</h1>
        <p className="text-sm text-muted-foreground">Молодец, {studentName}! Ты прошёл квест.</p>

        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <div className="text-xl font-bold text-green-700">{collected.length}/6</div>
            <div className="text-xs text-green-600">ингредиентов</div>
          </div>
          <div className={`border rounded-xl px-5 py-3 ${mistakes === 0 ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-200"}`}>
            <div className={`text-xl font-bold ${mistakes === 0 ? "text-amber-700" : "text-stone-600"}`}>{mistakes}</div>
            <div className={`text-xs ${mistakes === 0 ? "text-amber-600" : "text-stone-500"}`}>{mistakes === 0 ? "ошибок! 🏆" : "ошибок"}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
            <div className="text-xl font-bold text-blue-700">{formatDuration(duration)}</div>
            <div className="text-xs text-blue-600">время</div>
          </div>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mt-4">
          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium ${
                collected.includes(q.ingredientEmoji)
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-stone-50 border border-stone-200 text-muted-foreground opacity-50"
              }`}
            >
              <span className="text-xl">{q.ingredientEmoji}</span>
              <span>{q.ingredient}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Рецепт */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BookOpen" size={17} />
          Рецепт приготовления
        </h2>
        <ol className="space-y-3">
          {RECIPE.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Пищевая ценность */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="BarChart2" size={17} />
          Пищевая ценность (1 штука)
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {RECIPE.nutrition.map((n) => (
            <div key={n.label} className="bg-white/70 rounded-xl p-3 text-center">
              <Icon name={n.icon} size={15} className="mx-auto mb-1 text-amber-600" />
              <div className="text-sm font-semibold text-foreground">{n.value}</div>
              <div className="text-xs text-muted-foreground">{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onRestart} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale">
        Попробовать снова 🔄
      </button>
    </div>
  );
}

// ─── Экран класса (для учителя) ──────────────────────────────────────────────

function ClassView() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(GET_URL)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось загрузить данные");
        setLoading(false);
      });
  }, []);

  const avg = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length * 10) / 10
    : 0;

  const hardestQuestion = (() => {
    const mistakes: Record<number, number> = {};
    results.forEach((r) => {
      (r.answers || []).forEach((a) => {
        if (!a.correct) mistakes[a.question_id] = (mistakes[a.question_id] || 0) + 1;
      });
    });
    const maxId = Object.entries(mistakes).sort((a, b) => b[1] - a[1])[0];
    if (!maxId) return null;
    const q = QUESTIONS.find((q) => q.id === Number(maxId[0]));
    return q ? { question: q, count: maxId[1] } : null;
  })();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Таблица класса</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Результаты всех учеников</p>
      </div>

      {loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Loader" size={28} className="mx-auto mb-3 animate-spin opacity-50" />
          <p className="text-sm">Загружаем данные...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-3">🎓</div>
          <p className="text-sm">Пока никто не прошёл квест.<br />Поделись ссылкой с учениками!</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          {/* Сводка */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{results.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">прошли квест</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{avg}</div>
              <div className="text-xs text-muted-foreground mt-0.5">ср. балл из 6</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.score === 6).length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">без ошибок</div>
            </div>
          </div>

          {/* Самая сложная задача */}
          {hardestQuestion && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
              <Icon name="AlertTriangle" size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-amber-800 mb-0.5">Самая сложная задача</div>
                <div className="text-sm text-foreground">{hardestQuestion.question.question}</div>
                <div className="text-xs text-amber-700 mt-1">{hardestQuestion.count} ошибок · {hardestQuestion.question.subjectLabel}</div>
              </div>
            </div>
          )}

          {/* Таблица */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-xs font-semibold text-muted-foreground bg-secondary px-4 py-2.5">
              <span>Ученик</span>
              <span className="text-center px-3">Балл</span>
              <span className="text-center px-3">Ошибки</span>
              <span className="text-right px-1">Время</span>
            </div>
            {results.map((r, i) => (
              <div
                key={r.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-0 px-4 py-3 items-center transition-colors hover:bg-secondary/40 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{r.student_name}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(r.created_at)}</div>
                </div>
                <div className="text-center px-3">
                  <span className={`text-sm font-bold ${r.score === 6 ? "text-green-600" : r.score >= 4 ? "text-amber-600" : "text-red-500"}`}>
                    {r.score}/6
                  </span>
                </div>
                <div className="text-center px-3">
                  <span className={`text-sm font-medium ${r.mistakes === 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    {r.mistakes === 0 ? "🏆" : r.mistakes}
                  </span>
                </div>
                <div className="text-right px-1 text-xs text-muted-foreground">
                  {formatDuration(r.duration_seconds)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}