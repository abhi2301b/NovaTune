import api from "../../services/api";

export const getAllMusic = async (page = 1, limit = 12) => {
    const response = await api.get(`/music?page=${page}&limit=${limit}`);
    return response.data;
};

export const uploadMusic = async (formData) => {
    const response = await api.post("/music/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getMyMusic = async () => {
    const response = await api.get("/music/my");
    return response.data;
};

export const getMyAlbums = async () => {
    const response = await api.get("/music/my-albums");
    return response.data;
};
