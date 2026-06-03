import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((c) =>
            c._id === commentId
              ? { ...c, likes: data.likes, numberOfLikes: data.likes.length }
              : c,
          ),
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c,
      ),
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await res.json();
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl font-sans">
      {/* Signed-in indicator */}
      {currentUser ? (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Signed in as</span>
          <img
            className="h-6 w-6 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-slate-500 dark:text-slate-400">
          You must be signed in to comment.
          <Link
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
            to="/sign-in"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Comment form */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <textarea
            placeholder="Add a comment…"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {200 - comment.length} characters remaining
            </p>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Submit
            </button>
          </div>
          {commentError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              <HiOutlineExclamationCircle className="text-lg" />
              {commentError}
            </div>
          )}
        </form>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="my-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No comments yet — be the first!
        </p>
      ) : (
        <>
          <div className="my-6 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>Comments</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800">
              {comments.length}
            </span>
          </div>
          <div className="space-y-1">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                  setShowModal(true);
                  setCommentToDelete(commentId);
                }}
              />
            ))}
          </div>
        </>
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
                onClick={() => handleDelete(commentToDelete)}
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
