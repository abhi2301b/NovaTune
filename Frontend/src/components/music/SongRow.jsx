import { Play, Music2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong, setQueue, playSong } from "../../features/player/playerSlice";

const SongRow = ({ song, index, songs = [] }) => {
    const dispatch = useDispatch();
    const { currentSong, isPlaying } = useSelector((s) => s.player);
    const isActive = currentSong?._id === song._id;

    const handlePlay = () => {
        dispatch(setQueue(songs));
        dispatch(setCurrentSong(song));
        dispatch(playSong());
    };

    return (
        <div
            onClick={handlePlay}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: isActive ? "rgba(34,211,238,0.06)" : "transparent",
                border: isActive ? "1px solid rgba(34,211,238,0.15)" : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.border = "1px solid transparent";
                }
            }}
        >
            {/* Index or equalizer */}
            <div style={{ width: 28, flexShrink: 0, textAlign: "center" }}>
                {isActive && isPlaying ? (
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 14 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                width: 2.5, borderRadius: 1, background: "#22D3EE",
                                transformOrigin: "bottom",
                                animation: `equalizer ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                                height: `${4 + i * 3}px`,
                            }} />
                        ))}
                    </div>
                ) : (
                    <span style={{ fontSize: 12, color: "#334155" }}>{index + 1}</span>
                )}
            </div>

            {/* Icon / Cover */}
            <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0, overflow: "hidden",
                background: isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <Music2 size={16} color={isActive ? "#22D3EE" : "#334155"} />
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 13, fontWeight: 600,
                    color: isActive ? "#22D3EE" : "#E2E8F0",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {song.title}
                </p>
                <p style={{ fontSize: 11, color: "#475569", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {song.artist?.username || "Unknown"}
                </p>
            </div>

            {/* Play icon on hover */}
            <Play size={14} color="#334155" fill="#334155" />
        </div>
    );
};

export default SongRow;
