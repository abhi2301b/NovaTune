import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as musicAPI from "./musicAPI";

const initialState = {
    songs: [],
    mySongs: [],
    myAlbums: [],
    hasMore: true,
    page: 1,
    loading: false,
    myLoading: false,
    uploading: false,
    error: null,
};

export const fetchAllMusic = createAsyncThunk(
    "music/fetchAllMusic",
    async ({ page = 1, limit = 12, reset = false } = {}, thunkAPI) => {
        try {
            const data = await musicAPI.getAllMusic(page, limit);
            return { ...data, reset, page };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch music"
            );
        }
    }
);

export const fetchMyMusic = createAsyncThunk(
    "music/fetchMyMusic",
    async (_, thunkAPI) => {
        try {
            const [songs, albums] = await Promise.all([
                musicAPI.getMyMusic(),
                musicAPI.getMyAlbums(),
            ]);
            return { songs, albums };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch your music"
            );
        }
    }
);

export const uploadMusic = createAsyncThunk(
    "music/uploadMusic",
    async (formData, thunkAPI) => {
        try {
            return await musicAPI.uploadMusic(formData);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Upload failed"
            );
        }
    }
);

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        clearMusicError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all music
            .addCase(fetchAllMusic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMusic.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.reset) {
                    state.songs = action.payload.musics || [];
                } else {
                    state.songs = [...state.songs, ...(action.payload.musics || [])];
                }
                state.hasMore = action.payload.hasMore;
                state.page = action.payload.page;
            })
            .addCase(fetchAllMusic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload music
            .addCase(uploadMusic.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadMusic.fulfilled, (state, action) => {
                state.uploading = false;
                if (action.payload.music) {
                    state.songs.unshift(action.payload.music);
                }
            })
            .addCase(uploadMusic.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            })

            // Fetch my music + albums (artist dashboard)
            .addCase(fetchMyMusic.pending, (state) => {
                state.myLoading = true;
                state.error = null;
            })
            .addCase(fetchMyMusic.fulfilled, (state, action) => {
                state.myLoading = false;
                state.mySongs  = action.payload.songs.musics  || [];
                state.myAlbums = action.payload.albums.albums || [];
            })
            .addCase(fetchMyMusic.rejected, (state, action) => {
                state.myLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMusicError } = musicSlice.actions;
export default musicSlice.reducer;
