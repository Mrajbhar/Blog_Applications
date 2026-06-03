import { Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) dispatch(signInFailure(data.message));
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans dark:bg-slate-950">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-500 to-indigo-600 p-10 text-white md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

          <Link to="/" className="relative flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <FaBookOpen className="text-lg" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight">
              ViewBlog
            </span>
          </Link>

          <div className="relative">
            <h2 className="font-serif text-3xl font-semibold leading-tight">
              Welcome back.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
              Sign in to explore insightful articles, tutorials, and stories on
              development, design, and more.
            </p>
          </div>

          <p className="relative text-xs text-white/60">
            &copy; {new Date().getFullYear()} ViewBlog
          </p>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          {/* Compact brand for mobile */}
          <Link to="/" className="mb-8 flex items-center gap-2.5 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white shadow-md">
              <FaBookOpen className="text-base" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              View<span className="text-teal-600 dark:text-teal-400">Blog</span>
            </span>
          </Link>

          <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your details to continue.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400">or</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <OAuth />
          </form>

          {errorMessage && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <HiOutlineExclamationCircle className="shrink-0 text-lg" />
              {errorMessage}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
