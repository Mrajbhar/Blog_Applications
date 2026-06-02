import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

// Lightweight placeholder shown while posts load
function PostSkeleton() {
  return (
    <div className='w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
      <div className='h-56 w-full animate-pulse bg-slate-200 dark:bg-slate-800' />
      <div className='space-y-3 p-5'>
        <div className='h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800' />
        <div className='h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800' />
        <div className='h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800' />
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
      {/* Hero */}
      <section className='relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'>
        {/* Soft decorative background — replaces the broken image path */}
        <div className='pointer-events-none absolute inset-0 opacity-70 dark:opacity-40'>
          <div className='absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-500/20' />
          <div className='absolute -right-16 top-10 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-500/20' />
          <div className='absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10' />
        </div>

        <div className='relative z-10 mx-auto max-w-5xl px-6 py-24 text-center sm:py-32'>
          <span className='inline-block rounded-full border border-slate-300 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400'>
            A creative journal
          </span>
          <h1 className='mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl'>
            Ideas worth
            <span className='block bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent'>
              writing down.
            </span>
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg'>
            Articles, tutorials, and field notes on web development, design,
            and the craft of building for the web.
          </p>
          <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              to='/search'
              className='inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
            >
              Explore posts
            </Link>
            <Link
              to='/about'
              className='inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900'
            >
              About the blog
            </Link>
          </div>
        </div>
      </section>

      {/* Recent articles */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:py-24'>
        <div className='mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
          <div>
            <h2 className='font-serif text-3xl font-semibold tracking-tight sm:text-4xl'>
              Recent articles
            </h2>
            <p className='mt-2 text-slate-600 dark:text-slate-400'>
              Fresh from the desk.
            </p>
          </div>
          <Link
            to='/search'
            className='group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400'
          >
            View all posts
            <span className='transition-transform duration-300 group-hover:translate-x-1'>
              &rarr;
            </span>
          </Link>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700'>
            <p className='text-slate-600 dark:text-slate-400'>
              No recent articles available yet — check back soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
