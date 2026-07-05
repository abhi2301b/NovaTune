import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import SubmitButton from "../components/auth/SubmitButton";
import { registerUser, clearError } from "../features/auth/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: "user" } });

    const onSubmit = (data) => {
        dispatch(registerUser({ username: data.username, email: data.email, password: data.password, role: data.role }));
    };

    useEffect(() => {
        if (isAuthenticated) { toast.success("Welcome to NovaTune! 🎵"); navigate("/"); }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    const selectedRole = watch("role");

    return (
        <AuthLayout title="Create account" subtitle="Join NovaTune and start your music journey.">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <InputField label="Username" placeholder="Choose a username" register={register} name="username" error={errors.username} />
                    <InputField label="Email address" type="email" placeholder="your@email.com" register={register} name="email" error={errors.email} />
                    <InputField label="Password" type="password" placeholder="Create a strong password" register={register} name="password" error={errors.password} />

                    {/* Role picker */}
                    <div>
                        <label style={{
                            display: "block", fontSize: 11, fontWeight: 700,
                            letterSpacing: "1.2px", textTransform: "uppercase",
                            color: "#64748B", marginBottom: 12,
                        }}>
                            I am a…
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                                { value: "user", emoji: "🎧", title: "Listener", desc: "Stream & discover" },
                                { value: "artist", emoji: "🎤", title: "Artist", desc: "Upload & create" },
                            ].map(({ value, emoji, title, desc }) => {
                                const active = selectedRole === value;
                                return (
                                    <label
                                        key={value}
                                        style={{
                                            position: "relative", display: "flex", flexDirection: "column",
                                            borderRadius: 12, padding: "14px 16px",
                                            cursor: "pointer", transition: "all 0.2s ease",
                                            background: active ? "rgba(34,211,238,0.07)" : "rgba(255,255,255,0.03)",
                                            border: active ? "1px solid rgba(34,211,238,0.35)" : "1px solid rgba(255,255,255,0.07)",
                                            boxShadow: active ? "0 0 0 2px rgba(34,211,238,0.08)" : "none",
                                        }}
                                    >
                                        <input type="radio" value={value} {...register("role")} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                                        <span style={{ fontSize: 22, marginBottom: 8 }}>{emoji}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#22D3EE" : "#E2E8F0" }}>{title}</span>
                                        <span style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{desc}</span>
                                        {active && (
                                            <div style={{
                                                position: "absolute", top: 10, right: 10,
                                                width: 8, height: 8, borderRadius: "50%",
                                                background: "#22D3EE",
                                                boxShadow: "0 0 8px rgba(34,211,238,0.6)",
                                            }} />
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: 4 }}>
                        <SubmitButton text="Create Account" loading={loading} />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                    <span style={{ fontSize: 12, color: "#334155" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <p style={{ textAlign: "center", fontSize: 13, color: "#64748B" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ fontWeight: 600, color: "#22D3EE", textDecoration: "none" }}>
                        Sign in →
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;