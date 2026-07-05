import { House, Disc3, Upload, Music2, Mic2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const { user } = useSelector((s) => s.auth);

    const navItem = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "9px 12px",
        borderRadius: "9px",
        fontSize: "13px",
        fontWeight: 500,
        transition: "all 0.15s ease",
        color: isActive ? "#22D3EE" : "#64748B",
        background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
        textDecoration: "none",
    });

    return (
        <aside
            style={{
                width: "210px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                background: "#0A0C12",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                overflowY: "auto",  /* independently scrollable */
                overflowX: "hidden",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: "22px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    flexShrink: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                            background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(34,211,238,0.3)",
                        }}
                    >
                        <Music2 size={16} color="white" />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
                            NovaTune
                        </p>
                        <p style={{ fontSize: 10, color: "#334155", marginTop: 1 }}>Feel Every Beat</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: "16px 10px" }}>
                <p style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "2px",
                    textTransform: "uppercase", color: "#1E2940",
                    padding: "0 8px", marginBottom: 10,
                }}>
                    Menu
                </p>

                <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <NavLink to="/" end style={navItem}>
                        {({ isActive }) => (
                            <><House size={16} color={isActive ? "#22D3EE" : "#64748B"} />Home</>
                        )}
                    </NavLink>

                    <NavLink to="/albums" style={navItem}>
                        {({ isActive }) => (
                            <><Disc3 size={16} color={isActive ? "#22D3EE" : "#64748B"} />Albums</>
                        )}
                    </NavLink>

                    {user?.role === "artist" && (
                        <>
                            {/* Divider — artist-only section */}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "8px 4px" }} />
                            <p style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: "2px",
                                textTransform: "uppercase", color: "#1E2940",
                                padding: "0 8px", marginBottom: 4,
                            }}>
                                Artist
                            </p>

                            <NavLink to="/my-music" style={navItem}>
                                {({ isActive }) => (
                                    <><Mic2 size={16} color={isActive ? "#22D3EE" : "#64748B"} />My Music</>
                                )}
                            </NavLink>

                            <NavLink to="/upload" style={navItem}>
                                {({ isActive }) => (
                                    <><Upload size={16} color={isActive ? "#22D3EE" : "#64748B"} />Upload</>
                                )}
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;