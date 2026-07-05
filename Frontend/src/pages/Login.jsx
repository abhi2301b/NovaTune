import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";
import SubmitButton from "../components/auth/SubmitButton";
import { loginUser, clearError } from "../features/auth/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch(loginUser({
            email: data.identifier.includes("@") ? data.identifier : "",
            username: data.identifier.includes("@") ? "" : data.identifier,
            password: data.password,
        }));
    };

    useEffect(() => {
        if (isAuthenticated) { toast.success("Welcome back! 🎵"); navigate("/"); }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    return (
        <AuthLayout title="Sign in" subtitle="Welcome back — pick up where you left off.">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Form fields with generous spacing */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <InputField
                        label="Username or Email"
                        placeholder="Enter your username or email"
                        register={register}
                        name="identifier"
                        error={errors.identifier}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        register={register}
                        name="password"
                        error={errors.password}
                    />

                    <div style={{ marginTop: 8 }}>
                        <SubmitButton text="Sign In" loading={loading} />
                    </div>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                    <span style={{ fontSize: 12, color: "#334155" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <p style={{ textAlign: "center", fontSize: 13, color: "#64748B" }}>
                    No account yet?{" "}
                    <Link to="/register" style={{ fontWeight: 600, color: "#22D3EE", textDecoration: "none" }}>
                        Create one →
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;