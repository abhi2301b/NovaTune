import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Music2, Disc3, Play, Upload, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";


import SongCard from "../components/music/SongCard";
import AlbumCard from "../components/album/AlbumCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { fetchMyMusic } from "../features/music/musicSlice";
import { setCurrentSong, setQueue, playSong } from "../features/player/playerSlice";

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 20px", borderRadius: 14,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
    }}>
        <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${color}15`, border: `1px solid ${color}25`,
        }}>
            <Icon size={19} color={color} />
        </div>
        <div>
            <p style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px", lineHeight: 1.2, marginTop: 3 }}>
                {value}
            </p>
        </div>
    </div>
);

// Section Header Component
const SectionHeader = ({ title, count, action, onAction }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.3px", margin: 0 }}>
                {title}
            </h2>
            <span style={{
                fontSize: 11, fontWeight: 600, color: "#22D3EE",
                background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: 100, padding: "2px 9px",
            }}>
                {count}
            </span>
        </div>
        {onAction && (
            <button
                onClick={onAction}
                style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, color: "#64748B",
                    background: "transparent", border: "none", cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#22D3EE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
            >
                <Upload size={13} />
                {action}
            </button>
        )}
    </div>
);

// Empty State Component
const Empty = ({ icon: Icon, message, sub, onCta, cta }) => (
    <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "48px 24px", borderRadius: 16,
        border: "1px dashed rgba(255,255,255,0.07)", textAlign: "center",
    }}>
        <Icon size={36} color="#1E2940" style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{message}</p>
        {sub && <p style={{ fontSize: 12, color: "#22D3EE", marginTop: 6 }}>{sub}</p>}
        {cta && (
            <button
                onClick={onCta}
                style={{
                    marginTop: 16, padding: "9px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                    border: "none", color: "white", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Inter, sans-serif",
                    boxShadow: "0 4px 16px rgba(34,211,238,0.25)",
                }}
            >
                {cta}
            </button>
        )}
    </div>
);

// Main Component
const MyMusic = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const { mySongs, myAlbums, myLoading } = useSelector((s) => s.music);

    useEffect(() => { dispatch(fetchMyMusic()); }, [dispatch]);

    const handlePlayAll = () => {
        if (mySongs.length > 0) {
            dispatch(setQueue(mySongs));
            dispatch(setCurrentSong(mySongs[0]));
            dispatch(playSong());
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Header Section */}
                <div style={{
                    position: "relative", borderRadius: 20, padding: "36px 40px",
                    marginBottom: 32, overflow: "hidden",
                    background: "linear-gradient(135deg, #0F1C2E 0%, #111520 60%, #0E0F18 100%)",
                    border: "1px solid rgba(34,211,238,0.08)",
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: "absolute", top: -60, left: -60, width: 280, height: 280,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(34,211,238,0.09) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                        <div>
                            {/* Badge */}
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                borderRadius: 100, padding: "4px 12px",
                                background: "rgba(34,211,238,0.08)",
                                border: "1px solid rgba(34,211,238,0.18)",
                                marginBottom: 14,
                            }}>
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#22D3EE" }}>
                                    Artist Studio
                                </span>
                            </div>

                            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.6px", margin: 0 }}>
                                My Music
                            </h1>
                            <p style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>
                                Everything you've uploaded as{" "}
                                <span style={{ color: "#22D3EE", fontWeight: 600 }}>
                                    {user?.username}
                                </span>
                            </p>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                                <button
                                    onClick={handlePlayAll}
                                    disabled={mySongs.length === 0}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 7,
                                        padding: "9px 20px", borderRadius: 100,
                                        background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                                        border: "none", color: "white", fontSize: 13, fontWeight: 700,
                                        cursor: mySongs.length === 0 ? "not-allowed" : "pointer",
                                        opacity: mySongs.length === 0 ? 0.4 : 1,
                                        boxShadow: "0 6px 20px rgba(34,211,238,0.28)",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    <Play size={14} fill="white" />
                                    Play All
                                </button>

                                <button
                                    onClick={() => dispatch(fetchMyMusic())}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 7,
                                        padding: "9px 18px", borderRadius: 100,
                                        background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#94A3B8", fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    <RefreshCw size={13} />
                                    Refresh
                                </button>

                                <button
                                    onClick={() => navigate("/upload")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 7,
                                        padding: "9px 18px", borderRadius: 100,
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#94A3B8", fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    <Upload size={13} />
                                    Upload
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <StatCard label="Songs" value={mySongs.length} icon={Music2} color="#22D3EE" />
                            <StatCard label="Albums" value={myAlbums.length} icon={Disc3} color="#A78BFA" />
                        </div>
                    </div>
                </div>

                {myLoading ? (
                    <LoadingSpinner size={42} />
                ) : (
                    <>
                        {/* Songs Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            style={{ marginBottom: 44 }}
                        >
                            <SectionHeader
                                title="Your Songs"
                                count={mySongs.length}
                                action="Upload new"
                                onAction={() => navigate("/upload")}
                            />

                            {mySongs.length === 0 ? (
                                <Empty
                                    icon={Music2}
                                    message="No songs uploaded yet"
                                    sub="Start building your catalogue"
                                    cta="Upload a Song"
                                    onCta={() => navigate("/upload")}
                                />
                            ) : (
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                                    gap: 14,
                                }}>
                                    {mySongs.map((song) => (
                                        <SongCard key={song._id} song={song} songs={mySongs} />
                                    ))}
                                </div>
                            )}
                        </motion.section>

                        {/* Albums Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14 }}
                        >
                            <SectionHeader
                                title="Your Albums"
                                count={myAlbums.length}
                                action="Create album"
                                onAction={() => navigate("/upload")}
                            />

                            {myAlbums.length === 0 ? (
                                <Empty
                                    icon={Disc3}
                                    message="No albums created yet"
                                    sub="Group your songs into an album"
                                    cta="Create an Album"
                                    onCta={() => navigate("/upload")}
                                />
                            ) : (
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                                    gap: 14,
                                }}>
                                    {myAlbums.map((album) => (
                                        <AlbumCard key={album._id} album={album} />
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    </>
                )}
            </motion.div>
        </>
    );
};

export default MyMusic;
