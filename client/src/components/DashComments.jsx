import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`,
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const th =
    "whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider";
  const td = "px-5 py-3 text-sm text-slate-700 dark:text-slate-300";

  return (
    <div className="font-sans">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className={th}>Date</th>
                  <th className={th}>Comment</th>
                  <th className={th}>Likes</th>
                  <th className={th}>Post ID</th>
                  <th className={th}>User ID</th>
                  <th className={th}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comments.map((comment) => (
                  <tr
                    key={comment._id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className={`${td} whitespace-nowrap`}>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </td>
                    <td className={`${td} max-w-sm`}>
                      <p className="line-clamp-2">{comment.content}</p>
                    </td>
                    <td className={td}>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium dark:bg-slate-800">
                        {comment.numberOfLikes}
                      </span>
                    </td>
                    <td
                      className={`${td} max-w-[8rem] truncate font-mono text-xs text-slate-400`}
                    >
                      {comment.postId}
                    </td>
                    <td
                      className={`${td} max-w-[8rem] truncate font-mono text-xs text-slate-400`}
                    >
                      {comment.userId}
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="font-medium text-red-500 transition-colors hover:text-red-600"
                      >
                        Delete
                      </button>
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
          You have no comments yet!
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteComment}
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
