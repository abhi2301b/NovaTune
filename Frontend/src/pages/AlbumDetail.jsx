import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, Disc3, Music2, Play } from "lucide-react";

import SongRow from "../components/music/SongRow";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { fetchAlbumById, clearCurrentAlbum } from "../features/album/albumSlice";
import {
    setCurrentSong,
    setQueue,
    playSong,
} from "../features/player/playerSlice";

const GRADIENTS = [
    ["#0F2027", "#203A43", "#22D3EE"],
    ["#1a1a2e", "#16213e", "#A78BFA"],
    ["#0f0c29", "#302b63", "#6366F1"],
    ["#1D2671", "#C33764", "#F472B6"],
    ["#004d40", "#00695C", "#34D399"],
    ["#1a1a1a", "#2d3561", "#60A5FA"],
];

const AlbumDetail = () => {
    // We named this 'albumId' in AppRoutes, but now it can be a title or ID
    const { albumId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentAlbum, loading } = useSelector((state) => state.album);

    useEffect(() => {
        dispatch(fetchAlbumById(albumId));
        return () => dispatch(clearCurrentAlbum());
    }, [albumId, dispatch]);

    const handlePlayAll = () => {
        if (currentAlbum?.music?.length > 0) {
            dispatch(setQueue(currentAlbum.music));
            dispatch(setCurrentSong(currentAlbum.music[0]));
            dispatch(playSong());
        }
    };

    const colorIndex = currentAlbum
        ? currentAlbum.title
              .split("")
              .reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length
        : 0;
        
    const [dark, mid] = GRADIENTS[colorIndex];

    return (
        <>
            {loading || !currentAlbum ? (
                <LoadingSpinner size={48} style={{ padding: "80px 0" }} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Back button */}
                    <button
                        onClick={() => navigate("/albums")}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            fontSize: 14, color: "#64748B", background: "none", border: "none",
                            cursor: "pointer", marginBottom: 32, transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#E2E8F0"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
                    >
                        <ArrowLeft size={16} />
                        Back to Albums
                    </button>

                    {/* Album Header */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 32, marginBottom: 40 }}>
                        {/* Cover Art */}
                        <div
                            style={{
                                width: 220, height: 220, flexShrink: 0,
                                borderRadius: 24, overflow: "hidden",
                                background: `linear-gradient(135deg, ${dark}, ${mid})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                            }}
                        >
                            {currentAlbum.imageUrl ? (
                                <img 
                                    src={currentAlbum.imageUrl} 
                                    alt={currentAlbum.title} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                            ) : (
                                <Disc3 size={80} color="rgba(255,255,255,0.7)" />
                            )}
                        </div>

                        {/* Info */}
                        <div style={{ minWidth: 0, paddingBottom: 10 }}>
                            <p style={{
                                fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: "3px", color: "#A78BFA", marginBottom: 8
                            }}>
                                Album
                            </p>
                            <h1 style={{
                                fontSize: 48, fontWeight: 800, color: "white",
                                margin: "0 0 16px 0", letterSpacing: "-1px"
                            }}>
                                {currentAlbum.title}
                            </h1>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#94A3B8" }}>
                                <span style={{ fontWeight: 600, color: "#E2E8F0" }}>
                                    {currentAlbum.artist?.username || "Unknown Artist"}
                                </span>
                                <span>•</span>
                                <span>
                                    {currentAlbum.music?.length || 0} track
                                    {currentAlbum.music?.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
                                <button
                                    onClick={handlePlayAll}
                                    disabled={!currentAlbum.music?.length}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "12px 32px", borderRadius: 100,
                                        background: "white", color: "#18181B",
                                        fontSize: 14, fontWeight: 700, border: "none",
                                        cursor: !currentAlbum.music?.length ? "not-allowed" : "pointer",
                                        opacity: !currentAlbum.music?.length ? 0.5 : 1,
                                        transition: "transform 0.2s, background 0.2s"
                                    }}
                                    onMouseEnter={(e) => { if (currentAlbum.music?.length) e.currentTarget.style.transform = "scale(1.05)"; }}
                                    onMouseLeave={(e) => { if (currentAlbum.music?.length) e.currentTarget.style.transform = "scale(1)"; }}
                                >
                                    <Play size={16} fill="currentColor" />
                                    Play All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Track List */}
                    <div style={{
                        borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)", padding: 8
                    }}>
                        {/* Header */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                            marginBottom: 8
                        }}>
                            <div style={{ width: 28, textAlign: "center", fontSize: 12, color: "#64748B" }}>#</div>
                            <div style={{ width: 36 }} />
                            <div style={{ flex: 1, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#64748B" }}>
                                Title
                            </div>
                        </div>

                        {currentAlbum.music?.length === 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", textAlign: "center" }}>
                                <Music2 size={40} color="#334155" style={{ marginBottom: 12 }} />
                                <p style={{ color: "#64748B" }}>This album has no tracks yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {currentAlbum.music.map((song, i) => (
                                    <SongRow
                                        key={song._id}
                                        song={song}
                                        index={i}
                                        songs={currentAlbum.music}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default AlbumDetail;
