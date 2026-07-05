const Avatar = ({ name = "U", size = 36 }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22D3EE, #0891B2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "white",
            fontSize: Math.max(11, size * 0.38),
            flexShrink: 0,
            boxShadow: "0 2px 10px rgba(34,211,238,0.25)",
        }}
    >
        {name.charAt(0).toUpperCase()}
    </div>
);

export default Avatar;