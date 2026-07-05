import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import AlbumDetail from "../pages/AlbumDetail";
import Upload from "../pages/Upload";
import MyMusic from "../pages/MyMusic";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayoutWrapper from "../components/layout/MainLayoutWrapper";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected Routes inside MainLayout */}
            <Route element={<ProtectedRoute><MainLayoutWrapper /></ProtectedRoute>}>
                <Route path="/" element={<Home />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/albums/:albumId" element={<AlbumDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/my-music" element={<MyMusic />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;