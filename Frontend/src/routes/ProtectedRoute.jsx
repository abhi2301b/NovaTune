import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, initialized } = useSelector(
        (state) => state.auth
    );

    if (loading || !initialized) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090B]">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;