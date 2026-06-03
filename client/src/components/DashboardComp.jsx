import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  const stats = [
    {
      label: "Total Users",
      total: totalUsers,
      last: lastMonthUsers,
      icon: HiOutlineUserGroup,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Total Comments",
      total: totalComments,
      last: lastMonthComments,
      icon: HiAnnotation,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Total Posts",
      total: totalPosts,
      last: lastMonthPosts,
      icon: HiDocumentText,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const card =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900";
  const seeAll =
    "rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-400";
  const th =
    "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";
  const td = "px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300";

  return (
    <div className="font-sans">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={card}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                    {s.total}
                  </p>
                </div>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}
                >
                  <Icon className="text-xl" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center font-medium text-teal-500">
                  <HiArrowNarrowUp />
                  {s.last}
                </span>
                <span className="text-slate-400">last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent tables */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Recent users */}
        <div className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-slate-900 dark:text-white">
              Recent users
            </h2>
            <Link to="/dashboard?tab=users" className={seeAll}>
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className={th}>User</th>
                  <th className={th}>Username</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className={td}>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="h-9 w-9 rounded-full bg-slate-200 object-cover"
                      />
                    </td>
                    <td className={td}>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent comments */}
        <div className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-slate-900 dark:text-white">
              Recent comments
            </h2>
            <Link to="/dashboard?tab=comments" className={seeAll}>
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className={th}>Comment</th>
                  <th className={th}>Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td className={`${td} max-w-xs`}>
                      <p className="line-clamp-2">{comment.content}</p>
                    </td>
                    <td className={td}>{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent posts */}
        <div className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-slate-900 dark:text-white">
              Recent posts
            </h2>
            <Link to="/dashboard?tab=posts" className={seeAll}>
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className={th}>Image</th>
                  <th className={th}>Title</th>
                  <th className={th}>Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td className={td}>
                      <img
                        src={post.image}
                        alt="post"
                        className="h-9 w-14 rounded-md bg-slate-200 object-cover"
                      />
                    </td>
                    <td className={`${td} max-w-[10rem] truncate`}>
                      {post.title}
                    </td>
                    <td className={td}>{post.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
