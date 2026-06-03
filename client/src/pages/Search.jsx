import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { AiOutlineSearch } from "react-icons/ai";

function CardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="h-52 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      setSidebarData({ ...sidebarData, sort: e.target.value || "desc" });
    }
    if (e.target.id === "category") {
      setSidebarData({
        ...sidebarData,
        category: e.target.value || "uncategorized",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950 md:flex">
      {/* Filters */}
      <aside className="border-b border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:w-80 md:border-b-0 md:border-r">
        <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
          Filters
        </h2>
        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Search term
            </label>
            <div className="relative">
              <AiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search articles…"
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sort
            </label>
            <select
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
              className={inputClass}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
              className={inputClass}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Apply Filters
          </button>
        </form>
      </aside>

      {/* Results */}
      <div className="min-w-0 flex-1">
        <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Search results
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {posts.length} {posts.length === 1 ? "article" : "articles"} found
            </p>
          )}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">
                No posts found.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {showMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={handleShowMore}
                    className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-400"
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
