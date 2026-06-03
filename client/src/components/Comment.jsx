import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const liked = currentUser && comment.likes.includes(currentUser._id);
  const canModify =
    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);

  return (
    <div className="flex gap-3 border-b border-slate-100 py-4 text-sm dark:border-slate-800">
      <img
        className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 object-cover ring-2 ring-slate-100 dark:ring-slate-700"
        src={user.profilePicture}
        alt={user.username}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-slate-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <textarea
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="pb-2 text-slate-600 dark:text-slate-300">
              {comment.content}
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1 transition-colors ${
                  liked ? "text-teal-500" : "text-slate-400 hover:text-teal-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              {comment.numberOfLikes > 0 && (
                <span className="text-slate-400">
                  {comment.numberOfLikes}{" "}
                  {comment.numberOfLikes === 1 ? "like" : "likes"}
                </span>
              )}
              {canModify && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="font-medium text-slate-400 transition-colors hover:text-teal-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className="font-medium text-slate-400 transition-colors hover:text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
