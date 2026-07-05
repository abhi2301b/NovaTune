import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import playerReducer from "../features/player/playerSlice";
import musicReducer from "../features/music/musicSlice";
import albumReducer from "../features/album/albumSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        player: playerReducer,
        music: musicReducer,
        album: albumReducer,
    },
});