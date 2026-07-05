import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({ label, type = "text", placeholder, register, name, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <label style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "#64748B",
                marginBottom: 8,
            }}>
                {label}
            </label>

            <div style={{ position: "relative" }}>
                <input
                    {...register(name, { required: `${label} is required` })}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 10,
                        padding: "0 16px",
                        paddingRight: isPassword ? 44 : 16,
                        fontSize: 14,
                        color: "#F1F5F9",
                        background: "rgba(255,255,255,0.04)",
                        border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        outline: "none",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.border = "1px solid rgba(34,211,238,0.5)";
                            e.target.style.boxShadow = "0 0 0 3px rgba(34,211,238,0.08)";
                            e.target.style.background = "rgba(34,211,238,0.03)";
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                            e.target.style.boxShadow = "none";
                            e.target.style.background = "rgba(255,255,255,0.04)";
                        }
                    }}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute", right: 14, top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#475569", padding: 0, display: "flex",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>

            {error && (
                <p style={{ fontSize: 12, color: "#F87171", marginTop: 6 }}>
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default InputField;