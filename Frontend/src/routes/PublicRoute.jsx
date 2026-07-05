import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#09090B] text-white">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;