import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCamera,
  HiOutlinePencilAlt,
  HiOutlineLogout,
} from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)",
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) dispatch(deleteUserFailure(data.message));
      else dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  const hasChanges = Object.keys(formData).length > 0;
  const memberSince = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-2xl font-sans">
      {/* Profile header */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-28 bg-gradient-to-r from-teal-500 to-indigo-500">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          </div>
        </div>

        <div className="px-6 pb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />

          {/* Avatar */}
          <div
            className="group relative -mt-14 h-28 w-28 cursor-pointer overflow-hidden rounded-full ring-4 ring-white dark:ring-slate-900"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                  },
                  path: {
                    stroke: `rgba(20, 184, 166, ${imageFileUploadProgress / 100})`,
                  },
                  text: { fill: "#14b8a6", fontSize: "1.4rem" },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="user"
              className={`h-full w-full rounded-full object-cover transition-opacity ${
                imageFileUploadProgress && imageFileUploadProgress < 100
                  ? "opacity-60"
                  : ""
              }`}
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              <HiOutlineCamera className="mb-0.5 text-lg" />
              Change
            </span>
          </div>

          {/* Identity */}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {currentUser.username}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    currentUser.isAdmin
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {currentUser.isAdmin ? "Admin" : "Member"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {currentUser.email}
              </p>
              {memberSince && (
                <p className="mt-1 text-xs text-slate-400">
                  Member since {memberSince}
                </p>
              )}
            </div>

            {currentUser.isAdmin && (
              <Link
                to="/create-post"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                <HiOutlinePencilAlt className="text-base" />
                New post
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Settings form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        {imageFileUploadError && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <HiOutlineExclamationCircle className="shrink-0 text-lg" />
            {imageFileUploadError}
          </div>
        )}

        {/* Account details */}
        <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
          Account details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="username" className={labelClass}>
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Security */}
        <h2 className="mt-8 font-serif text-lg font-semibold text-slate-900 dark:text-white">
          Security
        </h2>
        <div className="mt-4">
          <label htmlFor="password" className={labelClass}>
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Leave blank to keep current"
              onChange={handleChange}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="text-lg" />
              ) : (
                <HiOutlineEye className="text-lg" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || imageFileUploading || !hasChanges}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading
            ? "Saving…"
            : hasChanges
              ? "Save changes"
              : "No changes to save"}
        </button>

        {updateUserSuccess && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400">
            <HiOutlineCheckCircle className="shrink-0 text-lg" />
            {updateUserSuccess}
          </div>
        )}
        {(updateUserError || error) && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <HiOutlineExclamationCircle className="shrink-0 text-lg" />
            {updateUserError || error}
          </div>
        )}
      </form>

      {/* Danger zone */}
      <div className="mt-6 rounded-3xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
        <h2 className="font-serif text-lg font-semibold text-red-600 dark:text-red-400">
          Danger zone
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Sign out of your account
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can sign back in anytime.
            </p>
          </div>
          <button
            onClick={handleSignout}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <HiOutlineLogout className="text-base" />
            Sign out
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-red-200 pt-4 dark:border-red-900/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Delete account
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This permanently removes your account and data.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Delete account
          </button>
        </div>
      </div>

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
              Are you sure you want to delete your account?
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
