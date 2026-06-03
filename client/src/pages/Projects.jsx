import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
// import CallToAction from "../components/CallToAction";

const projects = [
  {
    title: "Responsive Landing Page",
    desc: "Build a polished, mobile-first landing page with semantic HTML and modern CSS layout.",
    level: "Beginner",
    tags: ["HTML", "CSS"],
  },
  {
    title: "Interactive Quiz App",
    desc: "Create a dynamic quiz with score tracking, timers, and instant feedback using vanilla JavaScript.",
    level: "Intermediate",
    tags: ["JavaScript", "DOM"],
  },
  {
    title: "Full-Stack Blog",
    desc: "Ship a complete blog with auth, a rich-text editor, and a dashboard — the stack powering this site.",
    level: "Advanced",
    tags: ["React", "MongoDB"],
  },
];

const levelStyles = {
  Beginner: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  Intermediate:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Advanced:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-500/20" />
          <div className="absolute -right-16 top-10 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-500/20" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-block rounded-full border border-slate-300 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Hands-on learning
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Build real projects.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Practical, guided projects to sharpen your skills in HTML, CSS, and
            JavaScript — designed to challenge and inspire.
          </p>
        </div>
      </section>

      {/* Project grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.title}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${levelStyles[p.level]}`}
              >
                {p.level}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                to="/search"
                className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400"
              >
                Start project
                <HiArrowRight className="transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Optional CTA — uncomment to use */}
      {/* <div className="mx-auto max-w-7xl px-6 pb-16"><CallToAction /></div> */}
    </div>
  );
}
