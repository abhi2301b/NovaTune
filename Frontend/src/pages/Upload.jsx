import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Music2, Disc3, Plus, X, CheckCircle, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import LoadingSpinner from "../components/common/LoadingSpinner";
import { uploadMusic, fetchMyMusic } from "../features/music/musicSlice";
import { createAlbum } from "../features/album/albumSlice";

// Reusable Image Picker Component
const ImagePicker = ({ label, file, onChange, onClear }) => (
    <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>
            {label}
        </p>
        {file ? (
            <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.25)",
            }}>
                <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#22D3EE", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                        {(file.size / 1024).toFixed(0)} KB
                    </p>
                </div>
                <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#F87171"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}>
                    <X size={16} />
                </button>
            </div>
        ) : (
            <label
                htmlFor={`img-${label}`}
                style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 18px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
                <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <ImageIcon size={18} color="#334155" />
                </div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>Choose cover image</p>
                    <p style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>JPG, PNG, WEBP · Optional</p>
                </div>
                <input id={`img-${label}`} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onChange(e.target.files[0])} />
            </label>
        )}
    </div>
);

// Main Upload Page Component
const Upload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const { mySongs, uploading } = useSelector((s) => s.music);
    const { loading: albumLoading } = useSelector((s) => s.album);

    const [activeTab, setActiveTab] = useState("song");
    const [dragOver, setDragOver] = useState(false);

    // Song upload state
    const [songTitle, setSongTitle] = useState("");
    const [songFile, setSongFile] = useState(null);
    const [songImage, setSongImage] = useState(null);

    // Album state
    const [albumTitle, setAlbumTitle] = useState("");
    const [albumImage, setAlbumImage] = useState(null);
    const [selectedSongIds, setSelectedSongIds] = useState([]);

    useEffect(() => { dispatch(fetchMyMusic()); }, [dispatch]);

    if (user?.role !== "artist") {
        return (
            <>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
                    <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                        <UploadIcon size={36} color="#1E2940" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#E2E8F0" }}>Artists Only</h2>
                    <p style={{ fontSize: 14, color: "#475569", marginTop: 10 }}>Only artists can upload music and create albums.</p>
                </div>
            </>
        );
    }

    const handleAudioFile = (file) => {
        if (file && file.type.startsWith("audio/")) setSongFile(file);
        else toast.error("Please select a valid audio file.");
    };

    const handleSongUpload = async (e) => {
        e.preventDefault();
        if (!songTitle.trim()) return toast.error("Please enter a title.");
        if (!songFile) return toast.error("Please select an audio file.");

        const formData = new FormData();
        formData.append("title", songTitle);
        formData.append("music", songFile);
        if (songImage) formData.append("image", songImage);

        const result = await dispatch(uploadMusic(formData));
        if (uploadMusic.fulfilled.match(result)) {
            toast.success("Song uploaded! 🎵");
            setSongTitle(""); setSongFile(null); setSongImage(null);
        } else {
            toast.error(result.payload || "Upload failed.");
        }
    };

    const handleAlbumCreate = async (e) => {
        e.preventDefault();
        if (!albumTitle.trim()) return toast.error("Please enter an album title.");
        if (selectedSongIds.length === 0) return toast.error("Select at least one song.");

        const formData = new FormData();
        formData.append("title", albumTitle);
        selectedSongIds.forEach((id) => formData.append("musicIds", id));
        if (albumImage) formData.append("image", albumImage);

        const result = await dispatch(createAlbum(formData));
        if (createAlbum.fulfilled.match(result)) {
            toast.success("Album created! 🎶");
            setAlbumTitle(""); setAlbumImage(null); setSelectedSongIds([]);
            navigate("/albums");
        } else {
            toast.error(result.payload || "Failed to create album.");
        }
    };

    const toggleSong = (id) => setSelectedSongIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

    const inputStyle = {
        width: "100%", height: 46, borderRadius: 10,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "0 16px", fontSize: 14, color: "#F1F5F9",
        outline: "none", fontFamily: "Inter, sans-serif",
        transition: "all 0.2s", boxSizing: "border-box",
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px" }}>Upload</h1>
                    <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Share your music with the world</p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "inline-flex", gap: 4,
                    padding: "4px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: 36,
                }}>
                    {[
                        { id: "song", label: "Upload Song", icon: Music2 },
                        { id: "album", label: "Create Album", icon: Disc3 },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "9px 18px", borderRadius: 9,
                                border: "none", cursor: "pointer",
                                fontSize: 13, fontWeight: 600,
                                fontFamily: "Inter, sans-serif",
                                transition: "all 0.2s ease",
                                color: activeTab === id ? "white" : "#64748B",
                                background: activeTab === id
                                    ? "linear-gradient(135deg, #22D3EE, #0891B2)"
                                    : "transparent",
                                boxShadow: activeTab === id ? "0 4px 16px rgba(34,211,238,0.25)" : "none",
                            }}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Song Upload Tab */}
                {activeTab === "song" && (
                    <motion.div key="song" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
                    >
                        <form onSubmit={handleSongUpload} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Title */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>
                                    Song Title
                                </p>
                                <input
                                    value={songTitle}
                                    onChange={(e) => setSongTitle(e.target.value)}
                                    placeholder="Enter song title…"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.border = "1px solid rgba(34,211,238,0.5)"; e.target.style.background = "rgba(34,211,238,0.03)"; }}
                                    onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                                />
                            </div>

                            {/* Audio drag-drop */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>
                                    Audio File
                                </p>
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleAudioFile(f); }}
                                    onClick={() => document.getElementById("audio-input").click()}
                                    style={{
                                        display: "flex", flexDirection: "column", alignItems: "center",
                                        justifyContent: "center", padding: "32px 20px", borderRadius: 14,
                                        border: `2px dashed ${dragOver ? "rgba(34,211,238,0.5)" : songFile ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.08)"}`,
                                        background: dragOver ? "rgba(34,211,238,0.05)" : songFile ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.02)",
                                        cursor: "pointer", transition: "all 0.2s",
                                    }}
                                >
                                    <input id="audio-input" type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => handleAudioFile(e.target.files[0])} />
                                    {songFile ? (
                                        <>
                                            <CheckCircle size={36} color="#22D3EE" style={{ marginBottom: 10 }} />
                                            <p style={{ fontSize: 13, fontWeight: 600, color: "#22D3EE" }}>{songFile.name}</p>
                                            <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{(songFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setSongFile(null); }}
                                                style={{ marginTop: 10, fontSize: 11, color: "#475569", background: "none", border: "none", cursor: "pointer" }}>
                                                Remove
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <UploadIcon size={36} color="#1E2940" style={{ marginBottom: 12 }} />
                                            <p style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Drop your audio file here</p>
                                            <p style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>or click to browse · MP3, WAV, FLAC</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cover image */}
                            <ImagePicker
                                label="Cover Image (optional)"
                                file={songImage}
                                onChange={setSongImage}
                                onClear={() => setSongImage(null)}
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={uploading}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    height: 46, borderRadius: 10, border: "none", cursor: uploading ? "not-allowed" : "pointer",
                                    background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                                    color: "white", fontSize: 14, fontWeight: 700,
                                    fontFamily: "Inter, sans-serif",
                                    opacity: uploading ? 0.6 : 1,
                                    boxShadow: "0 6px 20px rgba(34,211,238,0.25)",
                                    transition: "all 0.2s",
                                }}
                            >
                                {uploading ? <><LoadingSpinner size={16} />Uploading…</> : <><UploadIcon size={15} />Upload Song</>}
                            </button>
                        </form>

                        {/* Right tips panel */}
                        <div style={{
                            padding: 28, borderRadius: 16,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", marginBottom: 20 }}>Tips</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    "Supported formats: MP3, WAV, FLAC, M4A",
                                    "Max file size: 50 MB",
                                    "Cover image: JPG or PNG, 500×500px or larger",
                                    "Use a descriptive title for better discovery",
                                    "After uploading, you can add songs to an album",
                                ].map((tip, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                                            background: "rgba(34,211,238,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 700, color: "#22D3EE",
                                        }}>
                                            {i + 1}
                                        </div>
                                        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Album Creation Tab */}
                {activeTab === "album" && (
                    <motion.div key="album" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
                    >
                        <form onSubmit={handleAlbumCreate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Album title */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>
                                    Album Title
                                </p>
                                <input
                                    value={albumTitle}
                                    onChange={(e) => setAlbumTitle(e.target.value)}
                                    placeholder="Enter album name…"
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.border = "1px solid rgba(34,211,238,0.5)"; e.target.style.background = "rgba(34,211,238,0.03)"; }}
                                    onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                                />
                            </div>

                            {/* Cover image */}
                            <ImagePicker
                                label="Album Cover (optional)"
                                file={albumImage}
                                onChange={setAlbumImage}
                                onClear={() => setAlbumImage(null)}
                            />

                            {/* Song selector */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>
                                    Select Songs <span style={{ color: "#334155", fontWeight: 500 }}>({selectedSongIds.length} selected)</span>
                                </p>

                                {mySongs.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "32px 20px", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.08)", color: "#334155" }}>
                                        <Music2 size={32} color="#1E2940" style={{ margin: "0 auto 10px" }} />
                                        <p style={{ fontSize: 13 }}>Upload songs first</p>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, padding: "4px 0" }}>
                                        {mySongs.map((song) => {
                                            const sel = selectedSongIds.includes(song._id);
                                            return (
                                                <div
                                                    key={song._id}
                                                    onClick={() => toggleSong(song._id)}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: 12,
                                                        padding: "10px 14px", borderRadius: 10,
                                                        cursor: "pointer", transition: "all 0.15s",
                                                        background: sel ? "rgba(34,211,238,0.07)" : "rgba(255,255,255,0.02)",
                                                        border: sel ? "1px solid rgba(34,211,238,0.25)" : "1px solid rgba(255,255,255,0.06)",
                                                    }}
                                                >
                                                    {/* Checkbox */}
                                                    <div style={{
                                                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                                                        border: sel ? "2px solid #22D3EE" : "2px solid #334155",
                                                        background: sel ? "#22D3EE" : "transparent",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        transition: "all 0.15s",
                                                    }}>
                                                        {sel && <CheckCircle size={11} color="white" fill="white" />}
                                                    </div>

                                                    {song.imageUrl ? (
                                                        <img src={song.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                                                    ) : (
                                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1E2433", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                            <Music2 size={16} color="#334155" />
                                                        </div>
                                                    )}

                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: sel ? "#22D3EE" : "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {song.title}
                                                        </p>
                                                        <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                                            {song.artist?.username || "Unknown"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={albumLoading}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    height: 46, borderRadius: 10, border: "none", cursor: albumLoading ? "not-allowed" : "pointer",
                                    background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                                    color: "white", fontSize: 14, fontWeight: 700,
                                    fontFamily: "Inter, sans-serif",
                                    opacity: albumLoading ? 0.6 : 1,
                                    boxShadow: "0 6px 20px rgba(34,211,238,0.25)",
                                    transition: "all 0.2s",
                                }}
                            >
                                {albumLoading ? <><LoadingSpinner size={16} />Creating…</> : <><Plus size={15} />Create Album</>}
                            </button>
                        </form>

                        {/* Album preview */}
                        <div style={{ padding: 28, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", marginBottom: 20 }}>Preview</h3>
                            <div style={{
                                width: 140, height: 140, borderRadius: 16,
                                background: albumImage ? "transparent" : "linear-gradient(135deg, #0F2027, #203A43)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                overflow: "hidden", marginBottom: 16,
                            }}>
                                {albumImage
                                    ? <img src={URL.createObjectURL(albumImage)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <Disc3 size={52} color="rgba(34,211,238,0.3)" />}
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 700, color: albumTitle ? "#F1F5F9" : "#334155" }}>
                                {albumTitle || "Untitled Album"}
                            </p>
                            <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                                {selectedSongIds.length} track{selectedSongIds.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default Upload;
