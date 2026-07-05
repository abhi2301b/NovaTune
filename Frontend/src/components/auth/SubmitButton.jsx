const SubmitButton = ({ text, loading }) => (
    <button
        type="submit"
        disabled={loading}
        className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
            background: loading
                ? "rgba(34,211,238,0.4)"
                : "linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)",
            boxShadow: loading ? "none" : "0 8px 24px rgba(34,211,238,0.25)",
        }}
    >
        {loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Please wait…
            </span>
        ) : text}
    </button>
);

export default SubmitButton;