import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import {
  HiChartPie,
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiArrowSmRight,
} from "react-icons/hi";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setTab(urlParams.get("tab") || "dash");
  }, [location.search]);

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

  // Build the visible items based on role
  const items = [
    ...(currentUser?.isAdmin
      ? [
          {
            key: "dash",
            to: "/dashboard?tab=dash",
            label: "Overview",
            icon: HiChartPie,
          },
        ]
      : []),
    {
      key: "profile",
      to: "/dashboard?tab=profile",
      label: "Profile",
      icon: HiUser,
      badge: currentUser?.isAdmin ? "Admin" : "User",
    },
    ...(currentUser?.isAdmin
      ? [
          {
            key: "posts",
            to: "/dashboard?tab=posts",
            label: "Posts",
            icon: HiDocumentText,
          },
          {
            key: "users",
            to: "/dashboard?tab=users",
            label: "Users",
            icon: HiOutlineUserGroup,
          },
          {
            key: "comments",
            to: "/dashboard?tab=comments",
            label: "Comments",
            icon: HiAnnotation,
          },
        ]
      : []),
  ];

  const Item = ({ item }) => {
    const active = tab === item.key;
    const Icon = item.icon;
    return (
      <Link
        to={item.to}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md shadow-indigo-500/20"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        }`}
      >
        <Icon
          className={`text-lg transition-transform duration-200 ${
            active ? "" : "group-hover:scale-110"
          }`}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              active
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col p-4">
        {/* User card */}
        {currentUser && (
          <div className="mb-4 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 md:flex">
            <img
              src={currentUser.profilePicture}
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/30"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                @{currentUser.username}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {currentUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav — horizontal scroll on mobile, vertical on desktop */}
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {items.map((item) => (
            <div key={item.key} className="shrink-0 md:shrink">
              <Item item={item} />
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={handleSignout}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400 md:mt-auto"
        >
          <HiArrowSmRight className="text-lg" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
