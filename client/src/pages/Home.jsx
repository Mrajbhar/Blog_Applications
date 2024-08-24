import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className='bg-gray-100 dark:bg-black min-h-screen'>
      {/* Hero Section */}
      <div className='relative py-24 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-black dark:via-gray-800 dark:to-gray-900'>
        <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: "url('path/to/your/background-image.jpg')" }} />
        <div className='relative z-10 max-w-4xl mx-auto text-center px-6'>
          <h1 className='text-5xl sm:text-6xl font-bold text-white leading-tight'>
            <span className='block'>Welcome to</span>
            <span className='block text-yellow-300'>My Creative Blog</span>
          </h1>
          <p className='mt-4 text-lg text-gray-100'>
            Discover articles, tutorials, and insights on web development, design, and more.
          </p>
          <Link
            to='/search'
            className='mt-8 inline-block bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105'
          >
            Explore Posts
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className='py-12 bg-gray-200 dark:bg-black'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-4xl font-bold text-gray-900 dark:text-white text-center mb-12'>
            Recent Articles
          </h2>
          {posts && posts.length > 0 ? (
            <div className='grid grid-cols-1 gap-20 sm:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => (
                <div key={post._id} className='relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:shadow-2xl hover:scale-105'>
                  <PostCard post={post} />
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-30' />
                  <div className='relative p-6 z-10'>
                    <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2'>{post.title}</h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-4'>{post.excerpt}</p>
                    <Link
                      to={`/post/${post._id}`}
                      className='inline-block bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-teal-600'
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-600 dark:text-gray-400'>
              No recent articles available.
            </p>
          )}
          <div className='text-center mt-8'>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 font-semibold hover:underline'
            >
              View all posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
