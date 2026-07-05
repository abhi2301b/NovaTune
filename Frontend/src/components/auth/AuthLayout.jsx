import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 24px",
                background: "linear-gradient(160deg, #0C0E14 0%, #0F1420 50%, #0C0E14 100%)",
                overflow: "auto",
            }}
        >
            {/* Ambient decorations */}
            <div style={{
                position: "fixed", top: -120, left: -120, width: 600, height: 600,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "fixed", bottom: -80, right: -80, width: 500, height: 500,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative", width: "100%", maxWidth: 480 }}
            >
                {/* Logo — sits above the card with breathing room */}
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 32 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(34,211,238,0.3)",
                    }}>
                        <Music2 size={20} color="white" />
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px" }}>
                        NovaTune
                    </span>
                </div>

                {/* Form card */}
                <div style={{
                    borderRadius: 20,
                    padding: "40px 40px 36px",
                    background: "rgba(17,21,32,0.85)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
                }}>
                    {/* Heading with proper bottom margin */}
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px", margin: 0 }}>
                            {title}
                        </h1>
                        <p style={{ fontSize: 14, color: "#64748B", marginTop: 8, lineHeight: 1.5, margin: "8px 0 0" }}>
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#1E2940" }}>
                    Feel Every Beat · NovaTune 2026
                </p>
            </motion.div>
        </div>
    );
};

export default AuthLayout;