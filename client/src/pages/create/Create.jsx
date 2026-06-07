import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadPost } from "../../store/slices/postSlice.js";
import { uploadLoopApi, uploadStoryApi } from "../../api/media.api.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineCloudUpload, AiOutlineClose } from "react-icons/ai";

const tabs = ["post", "loop", "story"];

function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") || "post";

  const [tab, setTab] = useState(defaultTab);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setMediaType(f.type.startsWith("video") ? "video" : "image");
    setPreview(URL.createObjectURL(f));
  };

  // const handleSubmit = async () => {
  //   if (!file) return setError("Please select a media file");
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const formData = new FormData();
  //     formData.append("mediaType", mediaType)
  //     if (caption) formData.append("caption", caption)
  //     formData.append("media", file)

  //     if (tab === "post") {
  //       await dispatch(uploadPost(formData)).unwrap();
  //     } else if (tab === "loop") {
  //       await uploadLoopApi(formData);
  //     } else {
  //       await uploadStoryApi(formData);
  //     }

  //     navigate(tab === "loop" ? "/loops" : "/");
  //   } catch (error) {
  //     setError(error?.message || "Upload failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a media file")
    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("mediaType", mediaType)  // ← text fields first ✅
      if (caption) formData.append("caption", caption)
      formData.append("media", file)           // ← file last ✅

      if (tab === "post") {
        await dispatch(uploadPost(formData)).unwrap()
      } else if (tab === "loop") {
        await uploadLoopApi(formData)
      } else {
        await uploadStoryApi(formData)
      }

      navigate(tab === "loop" ? "/loops" : "/")
    } catch (error) {
      setError(error?.message || "Upload failed")
    } finally {
      setLoading(false)
    }
}

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">Create</h1>

      {/* Tabs */}
      <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setFile(null);
              setPreview(null);
              setCaption("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Media Upload */}
      <div
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
          preview
            ? "border-[#a855f7]/30"
            : "border-white/10 hover:border-white/20 cursor-pointer"
        } mb-4`}
      >
        {preview ? (
          <div className="relative">
            {mediaType === "video" ? (
              <video
                src={preview}
                controls
                className="w-full max-h-80 object-contain bg-black/20"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-80 object-cover"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <AiOutlineClose />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AiOutlineCloudUpload className="text-5xl text-white/20" />
            <p className="text-white/40 text-sm">
              Click to upload {tab === "story" ? "photo or video" : "media"}
            </p>
            <p className="text-white/20 text-xs">
              JPG, PNG, MP4, MOV supported
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {tab !== "story" && (
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows={3}
          className="w-full bg-white/5 text-white placeholder-white/30 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors resize-none mb-4 text-sm"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
      >
        {loading ? "Uploading..." : `Share ${tab}`}
      </button>
    </div>
  );
}

export default Create;
