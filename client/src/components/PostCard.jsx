import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className='group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900'>
      {/* Cover image */}
      <Link to={`/post/${post.slug}`} className='block overflow-hidden'>
        <div className='relative h-52 w-full overflow-hidden'>
          <img
            src={post.image}
            alt={post.title}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          />
          {post.category && (
            <span className='absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-200'>
              {post.category}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='line-clamp-2 font-serif text-xl font-semibold leading-snug tracking-tight'>
          <Link
            to={`/post/${post.slug}`}
            className='transition-colors hover:text-teal-600 dark:hover:text-teal-400'
          >
            {post.title}
          </Link>
        </h3>

        <Link
          to={`/post/${post.slug}`}
          className='mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400'
        >
          Read article
          <span className='transition-transform duration-300 group-hover:translate-x-1'>
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}
