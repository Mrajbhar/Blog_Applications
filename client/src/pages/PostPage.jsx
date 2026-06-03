import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data.posts[0]);
      } catch (error) {
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, navigate]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        if (!res.ok) throw new Error("Failed to fetch recent posts");
        const data = await res.json();
        setRecentPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="xl" />
      </div>
    );

  if (error || !post)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950">
        <h2 className="font-serif text-2xl text-slate-900 dark:text-white">
          Post not found.
        </h2>
        <Link
          to="/"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Go back home
        </Link>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950">
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <Link
            to={`/search?category=${post.category}`}
            className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-400"
          >
            {post.category}
          </Link>
          <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white lg:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>{(post.content.length / 1000).toFixed(0)} min read</span>
          </div>
        </div>

        {/* Cover */}
        <img
          src={post.image}
          alt={post.title}
          className="mt-8 max-h-[600px] w-full rounded-2xl object-cover shadow-lg shadow-slate-900/5"
        />

        {/* Content */}
        <div
          className="post-content prose prose-slate mx-auto mt-10 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Optional CTA — uncomment to use */}
        {/* <div className="mt-10"><CallToAction /></div> */}

        <div className="mt-12">
          <CommentSection postId={post._id} />
        </div>
      </article>

      {/* Recent articles */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Recent articles
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {recentPosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
