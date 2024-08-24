import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 mb-6">
        Exciting Projects Await!
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl text-center">
        Dive into a world of creativity and innovation with our exciting
        projects! Whether you're looking to master HTML, CSS, or JavaScript, our
        hands-on projects will help you build practical skills while having fun.
        Each project is designed to challenge and inspire you, making learning
        an engaging and enjoyable experience.
      </p>
      {/* Add CallToAction component here if needed */}
    </div>
  );
}
