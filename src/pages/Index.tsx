import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Типы ───────────────────────────────────────────────────────────────────

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

// ─── Данные: 6 задач → 1 рецепт ─────────────────────────────────────────────

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
    explanation: "2 ÷ 3/4 = 2 × 4/3 = 8/3 ≈ 2,67 раза. То есть полностью можно приготовить 2 раза и останется ещё ⅔ порции.",
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
    formula: "Калории = (белки × 4) + (жиры × 9) + (углеводы × 4)",
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
  description: "Ты решил все задачи и собрал все ингредиенты! Вот твой заслуженный рецепт.",
  steps: [
    "Смешай 500 г муки, 300 г сливочного масла, 7 г соли и 50 г сахара.",
    "Добавь 280 мл тёплого молока (около 35°C = 308 К) и замеси тесто.",
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
  math: "bg-blue-50 border-blue-200 text-blue-700",
  physics: "bg-amber-50 border-amber-200 text-amber-700",
  chemistry: "bg-green-50 border-green-200 text-green-700",
  cooking: "bg-rose-50 border-rose-200 text-rose-700",
};

const subjectBadge: Record<string, string> = {
  math: "bg-blue-100 text-blue-700",
  physics: "bg-amber-100 text-amber-700",
  chemistry: "bg-green-100 text-green-700",
  cooking: "bg-rose-100 text-rose-700",
};

// ─── Главный компонент ───────────────────────────────────────────────────────

export default function Index() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [collected, setCollected] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const question = QUESTIONS[current];
  const isCorrect = selected === question.correct;
  const progress = (current / QUESTIONS.length) * 100;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setCollected((prev) => [...prev, question.ingredientEmoji]);
    } else {
      setMistakes((m) => m + 1);
    }
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      setStep("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function handleRestart() {
    setStep("intro");
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCollected([]);
    setMistakes(0);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <span className="font-semibold text-foreground text-base">Кулинарная наука</span>
            <div className="text-xs text-muted-foreground">Реши задачи — получи рецепт</div>
          </div>
        </div>
        {step === "quiz" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-lg">{collected.map((e) => e).join(" ")}</span>
            {collected.length === 0 && <span className="text-xs">Ингредиенты появятся здесь</span>}
          </div>
        )}
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-xl">

          {/* INTRO */}
          {step === "intro" && (
            <div className="animate-fade-in text-center">
              <div className="text-6xl mb-6">🍳</div>
              <h1 className="text-3xl font-semibold text-foreground mb-3">Стань шеф-поваром</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Реши 6 задач по математике, физике, химии и кулинарии.<br />
                За каждый правильный ответ ты получишь ингредиент.<br />
                Собери все 6 — и получишь настоящий рецепт!
              </p>

              {/* Что предстоит */}
              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                {[
                  { icon: "Calculator", label: "Математика", desc: "Пропорции и расчёты", color: "bg-blue-50 border-blue-200" },
                  { icon: "Thermometer", label: "Физика", desc: "Температура и время", color: "bg-amber-50 border-amber-200" },
                  { icon: "FlaskConical", label: "Химия", desc: "БЖУ и калории", color: "bg-green-50 border-green-200" },
                  { icon: "ChefHat", label: "Кулинария", desc: "Техника приготовления", color: "bg-rose-50 border-rose-200" },
                ].map((s) => (
                  <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
                    <Icon name={s.icon} size={20} className="mb-2 text-foreground/70" />
                    <div className="text-sm font-semibold text-foreground">{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("quiz")}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale transition-all"
              >
                Начать готовить! 🚀
              </button>
            </div>
          )}

          {/* QUIZ */}
          {step === "quiz" && (
            <div className="animate-fade-in">
              {/* Прогресс */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Задача {current + 1} из {QUESTIONS.length}</span>
                  <span>{collected.length} ингредиентов собрано</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="progress-bar h-2 transition-all duration-500"
                    style={{ width: `${progress + (100 / QUESTIONS.length)}%` }}
                  />
                </div>
                {/* Шаги */}
                <div className="flex gap-1.5 mt-3">
                  {QUESTIONS.map((q, i) => (
                    <div
                      key={q.id}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        i < current
                          ? "bg-green-400"
                          : i === current
                          ? "bg-amber-400"
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Карточка вопроса */}
              <div className={`border rounded-2xl p-6 mb-5 ${subjectColors[question.subject]}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subjectBadge[question.subject]}`}>
                    <Icon name={question.subjectIcon} size={11} className="inline mr-1" />
                    {question.subjectLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">→ ингредиент: {question.ingredientEmoji} {question.ingredient}</span>
                </div>
                <p className="text-foreground font-medium leading-relaxed text-base">{question.question}</p>

                {/* Подсказка */}
                <div className="mt-4 bg-white/60 rounded-xl px-4 py-3 flex items-start gap-2">
                  <Icon name="Lightbulb" size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-foreground mb-0.5">Подсказка</div>
                    <div className="text-xs text-muted-foreground">{question.hint}</div>
                    <div className="text-xs font-mono text-foreground/70 mt-1">{question.formula}</div>
                  </div>
                </div>
              </div>

              {/* Варианты ответов */}
              <div className="space-y-2.5 mb-5">
                {question.options.map((opt, idx) => {
                  let style = "bg-card border border-border text-foreground hover:bg-secondary";
                  if (answered) {
                    if (idx === question.correct) style = "bg-green-50 border-green-400 text-green-800";
                    else if (idx === selected) style = "bg-red-50 border-red-400 text-red-800";
                    else style = "bg-card border border-border text-muted-foreground opacity-60";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border font-medium text-sm transition-all duration-200 flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {answered && idx === question.correct && <Icon name="CheckCircle" size={18} className="text-green-600" />}
                      {answered && idx === selected && idx !== question.correct && <Icon name="XCircle" size={18} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Разбор ответа */}
              {answered && (
                <div className={`rounded-2xl px-5 py-4 mb-5 animate-fade-in ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
                    <div>
                      <div className={`font-semibold text-sm mb-1 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                        {isCorrect ? `Верно! Ты получаешь: ${question.ingredientEmoji} ${question.ingredient}` : "Неверно, но не беда!"}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{question.explanation}</p>
                      {!isCorrect && (
                        <div className="mt-2 bg-white/70 rounded-lg px-3 py-2">
                          <div className="text-xs font-medium text-foreground mb-0.5">Правильное решение:</div>
                          <div className="text-xs font-mono text-foreground/70">{question.formula}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопка далее */}
              {answered && (
                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale animate-fade-in"
                >
                  {current + 1 >= QUESTIONS.length ? "Получить рецепт! 🍽️" : "Следующая задача →"}
                </button>
              )}
            </div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{RECIPE.emoji}</div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">{RECIPE.title}</h1>
                <p className="text-muted-foreground text-sm mb-4">{RECIPE.description}</p>

                {/* Счёт */}
                <div className="flex justify-center gap-4 mb-2">
                  <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                    <div className="text-xl font-bold text-green-700">{collected.length}/6</div>
                    <div className="text-xs text-green-600">ингредиентов</div>
                  </div>
                  <div className={`border rounded-xl px-5 py-3 ${mistakes === 0 ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-200"}`}>
                    <div className={`text-xl font-bold ${mistakes === 0 ? "text-amber-700" : "text-stone-600"}`}>{mistakes}</div>
                    <div className={`text-xs ${mistakes === 0 ? "text-amber-600" : "text-stone-500"}`}>
                      {mistakes === 0 ? "ошибок! 🏆" : "ошибок"}
                    </div>
                  </div>
                </div>

                {/* Собранные ингредиенты */}
                <div className="flex justify-center flex-wrap gap-2 my-4">
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
              <div className="bg-card border border-border rounded-2xl p-6 mb-5">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={18} />
                  Рецепт приготовления
                </h2>
                <ol className="space-y-3">
                  {RECIPE.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Пищевая ценность */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="ChartBar" size={18} />
                  Пищевая ценность (1 штука)
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {RECIPE.nutrition.map((n) => (
                    <div key={n.label} className="bg-white/70 rounded-xl p-3 text-center">
                      <Icon name={n.icon} size={16} className="mx-auto mb-1 text-amber-600" />
                      <div className="text-sm font-semibold text-foreground">{n.value}</div>
                      <div className="text-xs text-muted-foreground">{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-base hover-scale"
              >
                Попробовать снова 🔄
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
