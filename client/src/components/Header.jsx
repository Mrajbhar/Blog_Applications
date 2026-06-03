import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import {
  FaMoon,
  FaSun,
  FaBookOpen,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa";
import {
  HiMenuAlt3,
  HiX,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiOutlineLogout,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
];

const blogCategories = [
  {
    to: "/blog/tech",
    title: "Tech",
    desc: "Trends in technology and development.",
  },
  {
    to: "/blog/lifestyle",
    title: "Lifestyle",
    desc: "Tips for a better lifestyle.",
  },
  {
    to: "/blog/travel",
    title: "Travel",
    desc: "Destinations and experiences.",
  },
];

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const blogRef = useRef(null);
  const userRef = useRef(null);
  const blogTimer = useRef(null);
  const userTimer = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get("searchTerm");
    if (term) setSearchTerm(term);
  }, [location.search]);

  useEffect(() => {
    setMobileOpen(false);
    setBlogOpen(false);
    setUserOpen(false);
  }, [path]);

  useEffect(() => {
    const onClick = (e) => {
      if (blogRef.current && !blogRef.current.contains(e.target))
        setBlogOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openBlog = () => {
    clearTimeout(blogTimer.current);
    setBlogOpen(true);
  };
  const closeBlog = () => {
    blogTimer.current = setTimeout(() => setBlogOpen(false), 120);
  };
  const openUser = () => {
    clearTimeout(userTimer.current);
    setUserOpen(true);
  };
  const closeUser = () => {
    userTimer.current = setTimeout(() => setUserOpen(false), 120);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const NavLink = ({ to, label }) => {
    const active = path === to;
    return (
      <Link
        to={to}
        className={`group relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
          active
            ? "text-slate-900 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        {label}
        <span
          className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  const SearchField = ({ className = "" }) => (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <AiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search articles…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-full border border-slate-200 bg-slate-100/70 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 font-sans backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <FaBookOpen className="text-base" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            View<span className="text-teal-600 dark:text-teal-400">Blog</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" label="Home" />

          {/* Blogs dropdown */}
          <div
            ref={blogRef}
            className="relative"
            onMouseEnter={openBlog}
            onMouseLeave={closeBlog}
          >
            <button
              type="button"
              onClick={() => setBlogOpen((o) => !o)}
              className={`group flex items-center gap-1 py-2 text-sm font-medium transition-colors duration-200 ${
                blogOpen
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Blogs
              <FaChevronDown
                className={`text-[10px] transition-transform duration-300 ${blogOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 origin-top rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5 transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
                blogOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              {blogCategories.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="group/item flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-800 transition-colors group-hover/item:text-teal-600 dark:text-slate-100 dark:group-hover/item:text-teal-400">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {c.desc}
                    </span>
                  </span>
                  <FaArrowRight className="mt-1 shrink-0 text-xs text-teal-500 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/about" label="About" />
          <NavLink to="/projects" label="Projects" />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchField className="hidden w-60 xl:block" />

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all duration-200 hover:rotate-12 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === "light" ? (
              <FaSun className="text-amber-500" />
            ) : (
              <FaMoon className="text-indigo-300" />
            )}
          </button>

          {currentUser ? (
            <div
              ref={userRef}
              className="relative"
              onMouseEnter={openUser}
              onMouseLeave={closeUser}
            >
              <button
                type="button"
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform duration-200 hover:scale-105"
              >
                <span className="relative">
                  <img
                    src={currentUser.profilePicture}
                    alt="user"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 transition-all dark:ring-slate-700"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-950" />
                </span>
                <FaChevronDown
                  className={`hidden text-[10px] text-slate-400 transition-transform duration-300 sm:block ${userOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* User panel */}
              <div
                className={`absolute right-0 top-full z-50 mt-3 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
                  userOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <img
                    src={currentUser.profilePicture}
                    alt="user"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/30"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        @{currentUser.username}
                      </p>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                          currentUser.isAdmin
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {currentUser.isAdmin ? "Admin" : "Member"}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-2 space-y-0.5">
                  <Link
                    to="/dashboard?tab=profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <HiOutlineUser className="text-lg text-slate-400" />
                    Profile
                  </Link>
                  {currentUser.isAdmin && (
                    <Link
                      to="/dashboard?tab=dash"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <HiOutlineViewGrid className="text-lg text-slate-400" />
                      Dashboard
                    </Link>
                  )}
                </div>

                <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />

                <button
                  onClick={handleSignout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <HiOutlineLogout className="text-lg" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:inline-block"
            >
              Sign In
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          >
            {mobileOpen ? (
              <HiX className="text-xl" />
            ) : (
              <HiMenuAlt3 className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-slate-200 transition-all duration-300 dark:border-slate-800 lg:hidden ${
          mobileOpen ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 bg-white px-4 py-5 dark:bg-slate-950 sm:px-6">
          <SearchField />

          {/* Mobile user card */}
          {currentUser && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <img
                src={currentUser.profilePicture}
                alt="user"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/30"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  @{currentUser.username}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.email}
                </p>
              </div>
              <Link
                to="/dashboard?tab=profile"
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-teal-600 shadow-sm dark:bg-slate-900 dark:text-teal-400"
              >
                Profile
              </Link>
            </div>
          )}

          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  path === item.to
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Blogs
            </p>
            {blogCategories.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-teal-400"
              >
                {c.title}
              </Link>
            ))}
          </nav>

          {currentUser ? (
            <button
              onClick={handleSignout}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/40"
            >
              <HiOutlineLogout className="text-base" />
              Sign out
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="block rounded-full bg-slate-900 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
