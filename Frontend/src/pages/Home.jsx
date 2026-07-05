import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Play, Disc3, Music2, RefreshCw, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";


import SongCard from "../components/music/SongCard";
import AlbumCard from "../components/album/AlbumCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

import { fetchAllMusic } from "../features/music/musicSlice";
import { fetchAllAlbums } from "../features/album/albumSlice";
import { setCurrentSong, setQueue, playSong } from "../features/player/playerSlice";

// Section Header Component
const SectionHeader = ({ title, route }) => {
    const navigate = useNavigate();
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
                {title}
            </h2>
            {route && (
                <button
                    onClick={() => navigate(route)}
                    style={{ fontSize: 12, fontWeight: 600, color: "#22D3EE", background: "none", border: "none", cursor: "pointer" }}
                >
                    View all →
                </button>
            )}
        </div>
    );
};

// Empty State Component
const EmptyState = ({ icon: Icon, message, sub }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.08)",
            textAlign: "center",
        }}
    >
        <Icon size={40} color="#1E2940" style={{ marginBottom: 14 }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{message}</p>
        {sub && <p style={{ fontSize: 12, color: "#22D3EE", marginTop: 6 }}>{sub}</p>}
    </div>
);

// Main Home Component
const Home = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { songs, loading: musicLoading } = useSelector((s) => s.music);
    const { albums, loading: albumLoading } = useSelector((s) => s.album);

    // Initial load
    useEffect(() => {
        dispatch(fetchAllMusic({ page: 1, limit: 50, reset: true }));
        dispatch(fetchAllAlbums());
    }, [dispatch]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            dispatch(setQueue(songs));
            dispatch(setCurrentSong(songs[0]));
            dispatch(playSong());
        }
    };

    const stats = [
        { label: "Songs", value: songs.length, icon: Music2, color: "#22D3EE" },
        { label: "Albums", value: albums.length, icon: Disc3, color: "#A78BFA" },
        { label: "Role", value: user?.role || "user", icon: TrendingUp, color: "#34D399" },
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    style={{
                        position: "relative",
                        borderRadius: 20,
                        overflow: "hidden",
                        padding: "44px 44px",
                        marginBottom: 36,
                        background: "linear-gradient(135deg, #0F1C2E 0%, #111520 60%, #0E0F18 100%)",
                        border: "1px solid rgba(34,211,238,0.08)",
                    }}
                >
                    {/* Glow */}
                    <div style={{
                        position: "absolute", top: -80, left: -80, width: 320, height: 320,
                        borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", bottom: -60, right: -60, width: 240, height: 240,
                        borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
                        <div style={{ maxWidth: 520 }}>
                            {/* Badge */}
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 7,
                                borderRadius: 100, padding: "5px 13px",
                                background: "rgba(34,211,238,0.08)",
                                border: "1px solid rgba(34,211,238,0.18)",
                                marginBottom: 18,
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3EE", animation: "ping 1.5s ease-in-out infinite" }} />
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#22D3EE" }}>
                                    Live Now
                                </span>
                            </div>

                            <h1 style={{ fontSize: 40, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.8px", lineHeight: 1.2, margin: 0 }}>
                                Hey,{" "}
                                <span style={{ background: "linear-gradient(135deg, #22D3EE, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    {user?.username || "Listener"}
                                </span>
                            </h1>

                            <p style={{ fontSize: 15, color: "#64748B", marginTop: 12, lineHeight: 1.6 }}>
                                Discover new sounds and stream your favourites — all in one place.
                            </p>

                            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                                <button
                                    onClick={handlePlayAll}
                                    disabled={songs.length === 0}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "11px 24px", borderRadius: 100,
                                        background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                                        border: "none", color: "white", fontSize: 13, fontWeight: 700,
                                        cursor: songs.length === 0 ? "not-allowed" : "pointer",
                                        opacity: songs.length === 0 ? 0.4 : 1,
                                        boxShadow: "0 8px 24px rgba(34,211,238,0.3)",
                                        transition: "all 0.2s",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    <Play size={14} fill="white" />
                                    Play All
                                </button>

                                <button
                                    onClick={() => { dispatch(fetchAllMusic()); dispatch(fetchAllAlbums()); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "11px 20px", borderRadius: 100,
                                        background: "transparent",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#94A3B8", fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", transition: "all 0.2s",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    <RefreshCw size={13} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Background decoration */}
                        <div style={{
                            width: 120, height: 120, flexShrink: 0,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.04) 60%, transparent 100%)",
                            border: "1px solid rgba(34,211,238,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Music2 size={44} color="rgba(34,211,238,0.5)" />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.07 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 44 }}
                >
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "18px 20px", borderRadius: 14,
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div style={{
                                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: `${color}15`, border: `1px solid ${color}25`,
                            }}>
                                <Icon size={18} color={color} />
                            </div>
                            <div>
                                <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
                                <p style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", textTransform: "capitalize", letterSpacing: "-0.5px", lineHeight: 1.2, marginTop: 3 }}>
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Featured Songs Section */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.13 }}
                    style={{ marginBottom: 48 }}
                >
                    <SectionHeader title="Featured Songs" />

                    {musicLoading ? (
                        <LoadingSpinner size={38} className="py-16" />
                    ) : songs.length === 0 ? (
                        <EmptyState
                            icon={Music2}
                            message="No songs yet"
                            sub={user?.role === "artist" ? "Upload your first track" : undefined}
                        />
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                            {songs.map((song) => (
                                <SongCard key={song._id} song={song} songs={songs} />
                            ))}
                        </div>
                    )}
                </motion.section>

                {/* Albums Section */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 }}
                >
                    <SectionHeader title="Albums" route="/albums" />

                    {albumLoading ? (
                        <LoadingSpinner size={38} className="py-16" />
                    ) : albums.length === 0 ? (
                        <EmptyState icon={Disc3} message="No albums yet" />
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                            {albums.slice(0, 6).map((album) => (
                                <AlbumCard key={album._id} album={album} />
                            ))}
                        </div>
                    )}
                </motion.section>
            </motion.div>
        </>
    );
};

export default Home;