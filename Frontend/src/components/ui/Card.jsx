const Card = ({
    children,
    className = "",
}) => {

    return (
        <div
            className={`
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-900/60
            backdrop-blur-xl
            shadow-xl
            p-6
            ${className}
        `}
        >
            {children}
        </div>
    );
};

export default Card;