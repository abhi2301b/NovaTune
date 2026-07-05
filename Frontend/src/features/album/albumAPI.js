import api from "../../services/api";

export const getAllAlbums = async () => {
    const response = await api.get("/music/albums");
    return response.data;
};

export const getAlbumById = async (albumId) => {
    const response = await api.get(`/music/album/${albumId}`);
    return response.data;
};

export const createAlbum = async (formData) => {
    // formData can be a plain object or FormData (for image uploads)
    if (formData instanceof FormData) {
        const response = await api.post("/music/album", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    }
    const response = await api.post("/music/album", formData);
    return response.data;
};
