import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Disc3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


import AlbumCard from "../components/album/AlbumCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { fetchAllAlbums } from "../features/album/albumSlice";

const Albums = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { albums, loading } = useSelector((state) => state.album);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchAllAlbums());
    }, [dispatch]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">Albums</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            {albums.length} collection{albums.length !== 1 ? "s" : ""} available
                        </p>
                    </div>

                    {user?.role === "artist" && (
                        <button
                            onClick={() => navigate("/upload")}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-900/30 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/50"
                        >
                            <Plus size={16} />
                            New Album
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingSpinner size={48} className="py-32" />
                ) : albums.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/30 py-32 text-center">
                        <Disc3 size={64} className="mb-5 text-zinc-700" />
                        <h3 className="text-lg font-semibold text-zinc-400">No albums yet</h3>
                        <p className="mt-2 text-sm text-zinc-600">
                            {user?.role === "artist"
                                ? "Create your first album in the Upload section."
                                : "Artists haven't published any albums yet."}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
                        }}
                        className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    >
                        {albums.map((album) => (
                            <motion.div
                                key={album._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <AlbumCard album={album} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default Albums;
