import { motion } from "framer-motion";
import { Disc3, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GRADIENTS = [
    ["#0F2027", "#203A43", "#22D3EE"],
    ["#1a1a2e", "#16213e", "#A78BFA"],
    ["#0f0c29", "#302b63", "#6366F1"],
    ["#1D2671", "#C33764", "#F472B6"],
    ["#004d40", "#00695C", "#34D399"],
    ["#1a1a1a", "#2d3561", "#60A5FA"],
];

const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    const idx = album.title.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
    const [dark, mid, accent] = GRADIENTS[idx];

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => navigate(`/albums/${encodeURIComponent(album.title)}`)}
            style={{
                cursor: "pointer",
                borderRadius: 14,
                padding: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        >
            {/* Cover art */}
            <div style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 10,
                background: `linear-gradient(135deg, ${dark}, ${mid})`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {album.imageUrl ? (
                    <img
                        src={album.imageUrl}
                        alt={album.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <>
                        <Disc3 size={40} color={`${accent}80`} />
                        <div style={{
                            position: "absolute", inset: 0,
                            background: `radial-gradient(circle at 50% 50%, ${accent}12 0%, transparent 70%)`,
                        }} />
                    </>
                )}
            </div>

            {/* Info */}
            <p style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {album.title}
            </p>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {album.artist?.username || "Unknown"}
            </p>
            {album.music && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
                    <Music2 size={10} color="#334155" />
                    <span style={{ fontSize: 10, color: "#334155" }}>
                        {album.music.length} track{album.music.length !== 1 ? "s" : ""}
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default AlbumCard;
