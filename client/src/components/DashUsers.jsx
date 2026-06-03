import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
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
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className={th}>Date created</th>
                  <th className={th}>User</th>
                  <th className={th}>Username</th>
                  <th className={th}>Email</th>
                  <th className={th}>Admin</th>
                  <th className={th}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className={td}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={td}>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="h-10 w-10 rounded-full bg-slate-200 object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                      />
                    </td>
                    <td
                      className={`${td} font-medium text-slate-900 dark:text-white`}
                    >
                      {user.username}
                    </td>
                    <td className={td}>{user.email}</td>
                    <td className={td}>
                      {user.isAdmin ? (
                        <FaCheck className="text-teal-500" />
                      ) : (
                        <FaTimes className="text-slate-300 dark:text-slate-600" />
                      )}
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
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
          You have no users yet!
        </p>
      )}

      {/* Confirm modal */}
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDeleteUser}
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
