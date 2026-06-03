import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useMemo, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlinePhotograph,
  HiOutlineCloudUpload,
  HiX,
  HiOutlinePencilAlt,
  HiOutlineEye,
} from "react-icons/hi";

const TITLE_MAX = 120;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({ status: "published" });
  const [publishError, setPublishError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // write | preview
  const [tagInput, setTagInput] = useState("");

  const navigate = useNavigate();

  const selectFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setImageUploadError(null);
  };

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((d) => ({ ...d, image: downloadURL }));
          });
        },
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setImageUploadProgress(null);
    setFormData((d) => ({ ...d, image: undefined }));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t) return;
    const tags = formData.tags || [];
    if (!tags.includes(t)) setFormData({ ...formData, tags: [...tags, t] });
    setTagInput("");
  };

  const removeTag = (t) =>
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((x) => x !== t),
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  // Derived helpers
  const titleLen = (formData.title || "").length;
  const uploaded = Boolean(formData.image);

  const slug = useMemo(
    () =>
      (formData.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "your-post-title",
    [formData.title],
  );

  const { words, mins } = useMemo(() => {
    const text = (formData.content || "").replace(/<[^>]+>/g, " ").trim();
    const w = text ? text.split(/\s+/).length : 0;
    return { words: w, mins: Math.max(1, Math.round(w / 200)) };
  }, [formData.content]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              New post
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Write your article and configure it on the right.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:flex lg:items-start lg:gap-8"
        >
          {/* Main column */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Title */}
            <div className={cardClass}>
              <input
                type="text"
                placeholder="Post title"
                required
                id="title"
                maxLength={TITLE_MAX}
                value={formData.title || ""}
                className="w-full bg-transparent font-serif text-2xl font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate">/post/{slug}</span>
                <span>
                  {titleLen}/{TITLE_MAX}
                </span>
              </div>
            </div>

            {/* Editor with Write/Preview tabs */}
            <div className={cardClass}>
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === "write"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <HiOutlinePencilAlt /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === "preview"
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <HiOutlineEye /> Preview
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  {words} words · {mins} min read
                </span>
              </div>

              {activeTab === "write" ? (
                <ReactQuill
                  theme="snow"
                  placeholder="Write something…"
                  className="mb-12 h-72"
                  modules={quillModules}
                  value={formData.content || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                />
              ) : (
                <div
                  className="post-content prose prose-slate min-h-[18rem] max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content ||
                      "<p class='text-slate-400'>Nothing to preview yet.</p>",
                  }}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-5 w-full space-y-5 lg:mt-0 lg:w-80 lg:shrink-0">
            {/* Publish card */}
            <div className={`${cardClass} lg:sticky lg:top-6`}>
              <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                Publish
              </h2>

              <div className="mt-4">
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status || "published"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Category</label>
                <select
                  id="category"
                  value={formData.category || "uncategorized"}
                  className={inputClass}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="uncategorized">Uncategorized</option>
                  <option value="javascript">JavaScript</option>
                  <option value="reactjs">React.js</option>
                  <option value="nextjs">Next.js</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                {formData.status === "draft" ? "Save draft" : "Publish post"}
              </button>

              {publishError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                  <HiOutlineExclamationCircle className="shrink-0 text-lg" />
                  {publishError}
                </div>
              )}
            </div>

            {/* Cover image */}
            <div className={cardClass}>
              <label className={labelClass}>Cover image</label>
              {!uploaded ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    selectFile(e.dataTransfer.files[0]);
                  }}
                  className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors duration-200 ${
                    dragging
                      ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/20"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <label className="flex cursor-pointer flex-col items-center gap-2">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                        <HiOutlinePhotograph className="text-xl" />
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {file ? (
                        <span className="font-medium text-slate-900 dark:text-white">
                          {file.name}
                        </span>
                      ) : (
                        <>
                          <span className="font-medium text-teal-600 dark:text-teal-400">
                            Upload
                          </span>{" "}
                          or drag &amp; drop
                        </>
                      )}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => selectFile(e.target.files[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleUpdloadImage}
                    disabled={imageUploadProgress || !file}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-500 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-teal-400 dark:hover:text-white"
                  >
                    {imageUploadProgress ? (
                      <div className="h-7 w-7">
                        <CircularProgressbar
                          value={imageUploadProgress}
                          text={`${imageUploadProgress || 0}%`}
                        />
                      </div>
                    ) : (
                      <>
                        <HiOutlineCloudUpload className="text-lg" /> Upload
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="group relative overflow-hidden rounded-xl">
                  <img
                    src={formData.image}
                    alt="cover"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-red-500"
                    aria-label="Remove image"
                  >
                    <HiX />
                  </button>
                </div>
              )}
              {imageUploadError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                  <HiOutlineExclamationCircle /> {imageUploadError}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className={cardClass}>
              <label className={labelClass}>Tags</label>
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <HiX className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag, press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className={`${inputClass} mt-2`}
              />
            </div>

            {/* Summary */}
            <div className={cardClass}>
              <label className={labelClass}>Summary</label>
              <textarea
                rows="3"
                placeholder="A short excerpt shown in listings…"
                value={formData.summary || ""}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className={`${inputClass} resize-none`}
              />
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
