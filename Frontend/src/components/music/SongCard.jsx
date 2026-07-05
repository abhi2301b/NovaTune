import { motion } from "framer-motion";
import { Play, Music2, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong, setQueue, playSong } from "../../features/player/playerSlice";

const handleDownload = (e, song) => {
    e.stopPropagation();
    if (!song.uri) return;
    const a = document.createElement("a");
    a.href = song.uri;
    a.download = `${song.title}.mp3`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const SongCard = ({ song, songs = [] }) => {
    const dispatch = useDispatch();
    const { currentSong, isPlaying } = useSelector((s) => s.player);
    const isActive = currentSong?._id === song._id;

    const handlePlay = () => {
        dispatch(setQueue(songs));
        dispatch(setCurrentSong(song));
        dispatch(playSong());
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handlePlay}
            style={{
                cursor: "pointer",
                borderRadius: 14,
                padding: 12,
                border: isActive
                    ? "1px solid rgba(34,211,238,0.35)"
                    : "1px solid rgba(255,255,255,0.06)",
                background: isActive
                    ? "rgba(34,211,238,0.05)"
                    : "rgba(255,255,255,0.02)",
                transition: "border-color 0.2s, background 0.2s",
                position: "relative",
            }}
        >
            {/* Artwork */}
            <div
                className="group"
                style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 10,
                    background: isActive
                        ? "linear-gradient(135deg, #164E63, #083344)"
                        : "linear-gradient(135deg, #1E2433, #131720)",
                }}
            >
                {/* Cover image */}
                {song.imageUrl ? (
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : isActive && isPlaying ? (
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: "100%", paddingBottom: 24 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{
                                width: 3, borderRadius: 2, background: "#22D3EE",
                                transformOrigin: "bottom",
                                animation: `equalizer ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                                height: `${10 + i * 5}px`,
                            }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Music2 size={28} color={isActive ? "#22D3EE" : "#1E2940"} />
                    </div>
                )}

                {/* Hover overlay with play button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.55)",
                    }}
                >
                    <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(34,211,238,0.4)",
                    }}>
                        <Play size={16} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                </motion.div>

                {/* Download button — top right corner */}
                <button
                    onClick={(e) => handleDownload(e, song)}
                    title="Download"
                    style={{
                        position: "absolute", top: 8, right: 8,
                        width: 28, height: 28, borderRadius: 7,
                        background: "rgba(14,18,28,0.85)", border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.15s ease",
                        opacity: 0, // shown via parent hover in CSS
                    }}
                    className="download-btn"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,211,238,0.2)"; e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(14,18,28,0.85)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                    <Download size={13} color="#22D3EE" />
                </button>

                <style>{`
                    .group:hover .download-btn { opacity: 1 !important; }
                `}</style>
            </div>

            {/* Info */}
            <p style={{
                fontSize: 12, fontWeight: 600,
                color: isActive ? "#22D3EE" : "#E2E8F0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
                {song.title}
            </p>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {song.artist?.username || "Unknown Artist"}
            </p>
        </motion.div>
    );
};

export default SongCard;
