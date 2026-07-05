import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "./authApi";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            return await authApi.register(userData);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            return await authApi.login(userData);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            return await authApi.getCurrentUser();
        } catch {
            return thunkAPI.rejectWithValue(null);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            await authApi.logout();
        } catch {
            return thunkAPI.rejectWithValue();
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        clearError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Current User
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.initialized = true;
                state.user = null;
                state.isAuthenticated = false;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;