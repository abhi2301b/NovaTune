import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as albumAPI from "./albumAPI";

const initialState = {
    albums: [],
    currentAlbum: null,
    loading: false,
    error: null,
};

export const fetchAllAlbums = createAsyncThunk(
    "album/fetchAllAlbums",
    async (_, thunkAPI) => {
        try {
            return await albumAPI.getAllAlbums();
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch albums"
            );
        }
    }
);

export const fetchAlbumById = createAsyncThunk(
    "album/fetchAlbumById",
    async (albumId, thunkAPI) => {
        try {
            return await albumAPI.getAlbumById(albumId);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch album"
            );
        }
    }
);

export const createAlbum = createAsyncThunk(
    "album/createAlbum",
    async (data, thunkAPI) => {
        try {
            return await albumAPI.createAlbum(data);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to create album"
            );
        }
    }
);

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        clearAlbumError(state) {
            state.error = null;
        },
        clearCurrentAlbum(state) {
            state.currentAlbum = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all albums
            .addCase(fetchAllAlbums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAlbums.fulfilled, (state, action) => {
                state.loading = false;
                state.albums = action.payload.albums || [];
            })
            .addCase(fetchAllAlbums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch album by ID
            .addCase(fetchAlbumById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentAlbum = null;
            })
            .addCase(fetchAlbumById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAlbum = action.payload.album || null;
            })
            .addCase(fetchAlbumById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create album
            .addCase(createAlbum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAlbum.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.album) {
                    state.albums.unshift(action.payload.album);
                }
            })
            .addCase(createAlbum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAlbumError, clearCurrentAlbum } = albumSlice.actions;
export default albumSlice.reducer;
