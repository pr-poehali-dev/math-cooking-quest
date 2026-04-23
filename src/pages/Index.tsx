import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "courses" | "progress" | "tests" | "schedule" | "profile";

const courses = [
  {
    id: 1,
    title: "Математический анализ",
    subtitle: "Пределы, производные, интегралы",
    progress: 68,
    lessons: 24,
    done: 16,
    color: "bg-amber-50 border-amber-200",
    tag: "Математика",
    tagColor: "bg-amber-100 text-amber-800",
  },
  {
    id: 2,
    title: "Физика для инженеров",
    subtitle: "Механика, термодинамика, оптика",
    progress: 42,
    lessons: 18,
    done: 7,
    color: "bg-stone-50 border-stone-200",
    tag: "Физика",
    tagColor: "bg-stone-100 text-stone-700",
  },
  {
    id: 3,
    title: "Основы программирования",
    subtitle: "Python: от основ до практики",
    progress: 91,
    lessons: 30,
    done: 27,
    color: "bg-green-50 border-green-200",
    tag: "IT",
    tagColor: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "Английский язык B2",
    subtitle: "Грамматика, разговорная практика",
    progress: 25,
    lessons: 40,
    done: 10,
    color: "bg-blue-50 border-blue-200",
    tag: "Языки",
    tagColor: "bg-blue-100 text-blue-800",
  },
];

const tests = [
  { id: 1, title: "Производные функций", subject: "Математика", questions: 15, time: "20 мин", status: "new", score: 0, due: "Сегодня" },
  { id: 2, title: "Законы Ньютона", subject: "Физика", questions: 10, time: "15 мин", status: "new", score: 0, due: "Завтра" },
  { id: 3, title: "Списки и циклы в Python", subject: "IT", questions: 12, time: "25 мин", status: "done", score: 94, due: "Вчера" },
  { id: 4, title: "Present Perfect vs Past Simple", subject: "Английский", questions: 20, time: "30 мин", status: "done", score: 78, due: "3 дня назад" },
];

const schedule = [
  { day: "Пн", date: "21", items: [{ time: "10:00", title: "Мат. анализ — Лекция", type: "lecture" }, { time: "14:00", title: "Физика — Семинар", type: "seminar" }] },
  { day: "Вт", date: "22", items: [{ time: "09:00", title: "Программирование — Практика", type: "practice" }] },
  { day: "Ср", date: "23", items: [{ time: "11:00", title: "Английский — Разговор", type: "seminar" }, { time: "15:30", title: "Тест: Производные", type: "test" }] },
  { day: "Чт", date: "24", items: [{ time: "10:00", title: "Мат. анализ — Практика", type: "practice" }] },
  { day: "Пт", date: "25", items: [{ time: "13:00", title: "Физика — Лабораторная", type: "practice" }, { time: "16:00", title: "Английский — Лекция", type: "lecture" }] },
];

const typeColors: Record<string, string> = {
  lecture: "bg-amber-100 text-amber-700",
  seminar: "bg-blue-100 text-blue-700",
  practice: "bg-green-100 text-green-700",
  test: "bg-red-100 text-red-700",
};

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "courses", label: "Курсы", icon: "BookOpen" },
  { id: "progress", label: "Прогресс", icon: "TrendingUp" },
  { id: "tests", label: "Тесты", icon: "ClipboardList" },
  { id: "schedule", label: "Расписание", icon: "Calendar" },
  { id: "profile", label: "Профиль", icon: "User" },
];

export default function Index() {
  const [active, setActive] = useState<Section>("home");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card h-screen sticky top-0 py-8 px-4 shrink-0">
        <div className="px-2 mb-10">
          <span className="font-cormorant text-2xl font-semibold text-foreground tracking-tight">Учёба</span>
          <div className="text-xs text-muted-foreground mt-0.5">образовательная платформа</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <div className="flex items-center gap-3 py-3 border-t border-border">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">А</div>
            <div>
              <div className="text-sm font-medium text-foreground">Алексей</div>
              <div className="text-xs text-muted-foreground">Студент</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2 px-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
              active === item.id ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 md:px-10 py-8 pb-24 md:pb-8 max-w-3xl">
        {active === "home" && <HomeSection setActive={setActive} />}
        {active === "courses" && <CoursesSection />}
        {active === "progress" && <ProgressSection />}
        {active === "tests" && <TestsSection />}
        {active === "schedule" && <ScheduleSection />}
        {active === "profile" && <ProfileSection />}
      </main>
    </div>
  );
}

function HomeSection({ setActive }: { setActive: (s: Section) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-1">Добро пожаловать, Алексей</h1>
        <p className="text-muted-foreground">Среда, 23 апреля · 4 курса активны</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Курсов", value: "4", icon: "BookOpen" },
          { label: "Пройдено уроков", value: "60", icon: "CheckCircle" },
          { label: "Средний балл", value: "86%", icon: "Award" },
          { label: "Дней подряд", value: "12", icon: "Flame" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 animate-fade-in"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon name={stat.icon} size={15} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Продолжить обучение</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {courses.slice(0, 2).map((c, i) => (
            <div
              key={c.id}
              className={`border rounded-xl p-5 cursor-pointer hover-scale ${c.color} animate-fade-in`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              onClick={() => setActive("courses")}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.tagColor}`}>{c.tag}</span>
                  <h3 className="font-semibold text-foreground mt-2 text-sm">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground mt-1" />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{c.done} из {c.lessons} уроков</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-1 bg-white/60 rounded-full overflow-hidden">
                  <div className="progress-bar" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's schedule */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Сегодня</h2>
        <div className="space-y-2">
          {schedule[2].items.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl px-5 py-3.5 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${0.2 + i * 0.06}s` }}
            >
              <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">{item.time}</div>
              <div className="flex-1 text-sm font-medium text-foreground">{item.title}</div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[item.type]}`}>
                {item.type === "lecture" ? "Лекция" : item.type === "seminar" ? "Семинар" : item.type === "practice" ? "Практика" : "Тест"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoursesSection() {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Мои курсы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{courses.length} активных курса</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover-scale">
          <Icon name="Plus" size={15} />
          Добавить
        </button>
      </div>

      <div className="relative mb-6">
        <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск курсов..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className={`border rounded-xl p-5 cursor-pointer hover-scale animate-fade-in ${c.color}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="mb-4">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.tagColor}`}>{c.tag}</span>
              <h3 className="font-semibold text-foreground mt-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.subtitle}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{c.done} из {c.lessons} уроков</span>
                <span className="font-medium">{c.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className="progress-bar" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
            <button className="mt-4 w-full text-sm font-medium py-2 bg-white/70 hover:bg-white/90 rounded-lg border border-white/80 transition-colors text-foreground">
              Продолжить урок {c.done + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressSection() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Прогресс</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Ваши достижения за апрель</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Общий прогресс</div>
            <div className="text-3xl font-semibold text-foreground mt-1">56%</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center">
            <Icon name="TrendingUp" size={24} className="text-amber-600" />
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="progress-bar h-2" style={{ width: "56%" }} />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {courses.map((c, i) => (
          <div
            key={c.id}
            className="bg-card border border-border rounded-xl px-5 py-4 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{c.title}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.tagColor}`}>{c.tag}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{c.progress}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="progress-bar h-1.5" style={{ width: `${c.progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>{c.done} уроков пройдено</span>
              <span>{c.lessons - c.done} осталось</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Активность на неделе</h2>
        <div className="flex items-end gap-2 h-20">
          {[40, 70, 55, 90, 60, 80, 35].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-amber-300 transition-all"
                style={{ height: `${v}%`, opacity: i === 3 ? 1 : 0.55 }}
              />
              <span className="text-[10px] text-muted-foreground">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestsSection() {
  const [filter, setFilter] = useState<"all" | "new" | "done">("all");
  const filtered = tests.filter((t) => filter === "all" || t.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Тесты</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{tests.filter((t) => t.status === "new").length} ожидают выполнения</p>
      </div>

      <div className="flex gap-2 mb-5">
        {(["all", "new", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f === "all" ? "Все" : f === "new" ? "Новые" : "Сданные"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className="bg-card border border-border rounded-xl p-5 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">{t.subject}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{t.due}</span>
                </div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="HelpCircle" size={12} />
                    {t.questions} вопросов
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {t.time}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                {t.status === "done" ? (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${t.score >= 80 ? "text-green-600" : "text-amber-600"}`}>{t.score}%</div>
                    <div className="text-xs text-muted-foreground">Сдан</div>
                  </div>
                ) : (
                  <button className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover-scale">
                    Начать
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(2);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Расписание</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Апрель 2026</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {schedule.map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(i)}
            className={`flex flex-col items-center min-w-[52px] py-2.5 px-3 rounded-xl transition-all ${
              activeDay === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary"
            }`}
          >
            <span className="text-xs font-medium opacity-70">{day.day}</span>
            <span className="text-lg font-semibold leading-tight">{day.date}</span>
            {day.items.length > 0 && (
              <div className={`w-1 h-1 rounded-full mt-1 ${activeDay === i ? "bg-white/60" : "bg-amber-400"}`} />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {schedule[activeDay].items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="CalendarOff" size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Занятий нет</p>
          </div>
        ) : (
          schedule[activeDay].items.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-sm font-medium text-muted-foreground w-14 shrink-0">{item.time}</div>
              <div className="flex-1 text-sm font-medium text-foreground">{item.title}</div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[item.type]}`}>
                {item.type === "lecture" ? "Лекция" : item.type === "seminar" ? "Семинар" : item.type === "practice" ? "Практика" : "Тест"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Профиль</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-2xl font-bold text-amber-700">А</div>
        <div>
          <div className="text-xl font-semibold text-foreground">Алексей Петров</div>
          <div className="text-sm text-muted-foreground mt-0.5">a.petrov@university.ru</div>
          <div className="text-xs text-muted-foreground mt-1">Студент · 2 курс</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Достижения</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "Flame", label: "12 дней подряд", color: "text-orange-500" },
            { icon: "Award", label: "Отличник", color: "text-amber-500" },
            { icon: "Zap", label: "Быстрый старт", color: "text-blue-500" },
          ].map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-2 py-3 bg-secondary rounded-xl">
              <Icon name={a.icon} size={22} className={a.color} />
              <span className="text-xs text-center text-muted-foreground leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {[
          { icon: "Bell", label: "Уведомления", desc: "Напоминания о занятиях" },
          { icon: "Shield", label: "Конфиденциальность", desc: "Настройки аккаунта" },
          { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка" },
        ].map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary transition-colors text-left ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Icon name={item.icon} size={16} className="text-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
