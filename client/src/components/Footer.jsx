import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

const linkColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/", external: false },
      { label: "About", to: "/about", external: false },
      { label: "Projects", to: "https://mohan-portfolio-react.vercel.app/", external: true },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Tech", to: "/blog/tech", external: false },
      { label: "Lifestyle", to: "/blog/lifestyle", external: false },
      { label: "Travel", to: "/blog/travel", external: false },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "#", external: true },
      { label: "Terms & Conditions", to: "#", external: true },
    ],
  },
];

const socials = [
  { icon: BsGithub, href: "https://github.com/Mrajbhar", label: "GitHub" },
  { icon: BsTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: BsInstagram, href: "https://www.instagram.com", label: "Instagram" },
  { icon: BsFacebook, href: "https://www.facebook.com", label: "Facebook" },
];

export default function FooterCom() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire this up to your newsletter / API endpoint
  };

  const FooterLink = ({ link }) =>
    link.external ? (
      <a
        href={link.to}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
      >
        <span className="transition-transform duration-200 group-hover:translate-x-1">{link.label}</span>
      </a>
    ) : (
      <Link
        to={link.to}
        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
      >
        <span className="transition-transform duration-200 group-hover:translate-x-1">{link.label}</span>
      </Link>
    );

  return (
    <footer className="border-t border-slate-200 bg-slate-50 font-sans transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <FaBookOpen className="text-base" />
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                View<span className="text-teal-600 dark:text-teal-400">Blog</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Articles, tutorials, and field notes on web development, design,
              and the craft of building for the web.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Join the newsletter
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-600/25 dark:bg-white dark:text-slate-900 dark:hover:bg-teal-500 dark:hover:text-white"
                >
                  <HiArrowRight className="text-lg" />
                </button>
              </div>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-7 dark:border-slate-800 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ViewBlog. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-200 hover:-translate-y-1 hover:border-teal-500 hover:bg-teal-500 hover:text-white dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-500"
              >
                <Icon className="text-base" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
