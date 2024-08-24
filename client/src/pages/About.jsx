export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-black dark:via-black dark:to-black">
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        <h1 className="text-5xl font-extrabold text-center my-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
          About ViewBlog
        </h1>
        <div className="text-lg text-gray-800 dark:text-gray-200 flex flex-col gap-6">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-teal-500">ViewBlog</span>! Our
            blog serves as a vibrant platform where enthusiastic individuals
            share their deep insights and expertise with a global audience. Our
            mission is to inspire, educate, and engage through thought-provoking
            content on technology, coding, design, and much more.
          </p>

          <p>
            At <span className="font-semibold text-teal-500">ViewBlog</span>,
            you will uncover a treasure trove of articles and tutorials that
            dive into various topics such as web development, software
            engineering, and the latest in tech innovations. Our content is
            continuously updated, so check back frequently for the freshest
            insights and updates.
          </p>

          <p>
            We are committed to building a thriving community where readers can
            interact, share their knowledge, and collaborate on exciting ideas.
            Feel free to leave comments, engage in discussions, and connect with
            fellow readers. Together, we can foster a dynamic and supportive
            environment for learning and growth.
          </p>
        </div>
      </div>
    </div>
  );
}
