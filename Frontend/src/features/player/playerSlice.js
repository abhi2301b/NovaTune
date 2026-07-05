import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },

    setQueue: (state, action) => {
      state.queue = action.payload;
    },

    playSong: (state) => {
      state.isPlaying = true;
    },

    pauseSong: (state) => {
      state.isPlaying = false;
    },

    setVolume: (state, action) => {
      state.volume = action.payload;
    },

    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action) => {
      state.duration = action.payload;
    },
  },
});

export const {
  setCurrentSong,
  setQueue,
  playSong,
  pauseSong,
  setVolume,
  setCurrentTime,
  setDuration,
} = playerSlice.actions;

export default playerSlice.reducer;