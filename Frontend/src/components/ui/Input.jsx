import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({
    label,
    type = "text",
    placeholder,
    register,
    name,
    error,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div className="space-y-2">

            {label && (
                <label className="text-sm text-zinc-300">
                    {label}
                </label>
            )}

            <div className="relative">

                <input
                    type={inputType}
                    placeholder={placeholder}
                    {...register(name)}
                    className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-700
                    bg-zinc-900/80
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-500/30
                "
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error.message}
                </p>
            )}

        </div>
    );
};

export default Input;