const LoadingSpinner = ({ size = 32, className = "" }) => (
    <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: "100%", padding: "32px 0" }}
    >
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `2px solid rgba(34,211,238,0.15)`,
                borderTopColor: "#22D3EE",
                animation: "spin 0.75s linear infinite",
            }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

export default LoadingSpinner;
