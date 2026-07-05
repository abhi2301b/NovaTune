const Button = ({
    children,
    type = "button",
    onClick,
    loading = false,
    variant = "primary",
    className = "",
}) => {

    const variants = {
        primary:
            "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white",

        secondary:
            "bg-zinc-800 hover:bg-zinc-700 text-white",

        danger:
            "bg-red-600 hover:bg-red-500 text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`
                w-full
                rounded-xl
                py-3
                font-semibold
                transition-all
                duration-300
                disabled:opacity-70
                disabled:cursor-not-allowed
                shadow-lg
                ${variants[variant]}
                ${className}
            `}
        >
            {loading ? "Please wait..." : children}
        </button>
    );
};

export default Button;