import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

const TAB_META = {
  dash: { label: "Overview", desc: "A snapshot of your blog at a glance." },
  profile: { label: "Profile", desc: "Manage your account details." },
  posts: { label: "Posts", desc: "Create, edit, and manage articles." },
  users: { label: "Users", desc: "View and manage registered users." },
  comments: { label: "Comments", desc: "Moderate reader comments." },
};

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "profile");
  }, [location.search]);

  const activeTab = tab || "profile";
  const meta = TAB_META[activeTab] || TAB_META.profile;

  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950 md:flex">
      {/* Sidebar */}
      <DashSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Section header */}
        <div className="border-b border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-900 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {meta.label}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {meta.desc}
          </p>
        </div>

        {/* Content region */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "profile" && <DashProfile />}
          {activeTab === "posts" && <DashPosts />}
          {activeTab === "users" && <DashUsers />}
          {activeTab === "comments" && <DashComments />}
          {activeTab === "dash" && <DashboardComp />}

          {/* Fallback so the area is never blank */}
          {!["profile", "posts", "users", "comments", "dash"].includes(
            activeTab,
          ) && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
              No component matched tab "{activeTab}".
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
