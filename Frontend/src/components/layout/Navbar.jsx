import { useRef, useState, useEffect } from "react";
import { Search, LogOut, User, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((s) => s.auth);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        setOpen(false);
        await dispatch(logoutUser());
        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <header
            style={{
                height: 60,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(17,21,32,0.9)",
                backdropFilter: "blur(12px)",
                position: "relative",
                zIndex: 20,
            }}
        >
            {/* Search */}
            <div style={{ position: "relative" }}>
                <Search
                    size={14}
                    color="#334155"
                    style={{
                        position: "absolute", left: 13, top: "50%",
                        transform: "translateY(-50%)", pointerEvents: "none",
                    }}
                />
                <input
                    type="text"
                    placeholder="Search songs, albums…"
                    style={{
                        height: 36, width: 280, borderRadius: 9,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        paddingLeft: 36, paddingRight: 14,
                        fontSize: 13, color: "#F1F5F9",
                        outline: "none", fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                        e.target.style.border = "1px solid rgba(34,211,238,0.4)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.07)";
                    }}
                    onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(255,255,255,0.07)";
                        e.target.style.boxShadow = "none";
                    }}
                />
            </div>

            {/* User dropdown trigger */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: open ? "rgba(255,255,255,0.06)" : "transparent",
                        border: "1px solid",
                        borderColor: open ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.07)",
                        borderRadius: 100, padding: "5px 10px 5px 5px",
                        cursor: "pointer", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        if (!open) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!open) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                        }
                    }}
                >
                    <Avatar name={user?.username || "G"} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>
                        {user?.username || "Guest"}
                    </span>
                    <ChevronDown
                        size={14} color="#64748B"
                        style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                </button>

                {/* Dropdown menu */}
                {open && (
                    <div
                        style={{
                            position: "absolute", top: "calc(100% + 10px)", right: 0,
                            width: 220, borderRadius: 14,
                            background: "#161B26",
                            border: "1px solid rgba(255,255,255,0.09)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
                            overflow: "hidden",
                            zIndex: 100,
                        }}
                    >
                        {/* User info header */}
                        <div style={{
                            padding: "16px 16px 12px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Avatar name={user?.username || "G"} size={36} />
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>
                                        {user?.username || "Guest"}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#475569", textTransform: "capitalize", marginTop: 2 }}>
                                        {user?.email || user?.role || "user"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div style={{ padding: "6px" }}>
                            <div
                                style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 12px", borderRadius: 8,
                                    cursor: "default", opacity: 0.4,
                                }}
                            >
                                <User size={15} color="#64748B" />
                                <span style={{ fontSize: 13, color: "#94A3B8" }}>Profile</span>
                                <span style={{ marginLeft: "auto", fontSize: 10, color: "#334155", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4 }}>
                                    soon
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />

                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 12px", borderRadius: 8,
                                    background: "transparent", border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "all 0.15s ease",
                                    fontFamily: "Inter, sans-serif",
                                    opacity: loading ? 0.5 : 1,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <LogOut size={15} color="#EF4444" />
                                <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 500 }}>
                                    {loading ? "Logging out…" : "Log out"}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;