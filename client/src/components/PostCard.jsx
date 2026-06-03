import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";

export default function PostCard({ post }) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Rough reading time if content is available
  const readMins = post.content
    ? Math.max(
        1,
        Math.round(
          post.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200,
        ),
      )
    : null;

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-900/60">
      {/* Cover */}
      <Link
        to={`/post/${post.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {/* subtle gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
              {post.category}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta */}
        {(date || readMins) && (
          <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
            {date && (
              <span className="flex items-center gap-1">
                <HiOutlineCalendar className="text-sm" />
                {date}
              </span>
            )}
            {readMins && (
              <span className="flex items-center gap-1">
                <HiOutlineClock className="text-sm" />
                {readMins} min read
              </span>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 font-serif text-xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-white">
          <Link
            to={`/post/${post.slug}`}
            className="transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400"
          >
            {post.title}
          </Link>
        </h3>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400"
          >
            Read article
            <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
