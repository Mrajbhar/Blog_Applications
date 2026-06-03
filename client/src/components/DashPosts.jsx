import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete),
        );
    } catch (error) {
      console.log(error.message);
    }
  };

  const th =
    "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider";
  const td =
    "whitespace-nowrap px-5 py-3 text-sm text-slate-700 dark:text-slate-300";

  return (
    <div className="font-sans">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className={th}>Date updated</th>
                  <th className={th}>Image</th>
                  <th className={th}>Title</th>
                  <th className={th}>Category</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className={td}>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className={td}>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-12 w-20 rounded-lg bg-slate-200 object-cover"
                        />
                      </Link>
                    </td>
                    <td
                      className={`${td} max-w-xs truncate font-medium text-slate-900 dark:text-white`}
                    >
                      <Link
                        to={`/post/${post.slug}`}
                        className="hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className={td}>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">
                        {post.category}
                      </span>
                    </td>
                    <td className={td}>
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/update-post/${post._id}`}
                          className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className="font-medium text-red-500 transition-colors hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleShowMore}
                className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-400"
              >
                Show more
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">
          You have no posts yet!
        </p>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h3 className="mb-5 text-base font-medium text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeletePost}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
