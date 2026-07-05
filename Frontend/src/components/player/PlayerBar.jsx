import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2 } from "lucide-react";
import {
    playSong, pauseSong, setCurrentSong, setCurrentTime,
    setDuration, setVolume,
} from "../../features/player/playerSlice";

const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const PlayerBar = () => {
    const dispatch = useDispatch();
    const { currentSong, queue, isPlaying, volume } = useSelector((s) => s.player);
    const audioRef = useRef(null);
    const [localTime, setLocalTime] = useState(0);
    const [localDur, setLocalDur] = useState(0);
    const [seeking, setSeeking] = useState(false);

    useEffect(() => {
        if (!audioRef.current || !currentSong?.uri) return;
        audioRef.current.src = currentSong.uri;
        audioRef.current.load();
        if (isPlaying) audioRef.current.play().catch(() => {});
    }, [currentSong]);

    useEffect(() => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const onTimeUpdate = () => {
        if (!seeking && audioRef.current) {
            setLocalTime(audioRef.current.currentTime);
            dispatch(setCurrentTime(audioRef.current.currentTime));
        }
    };

    const onLoaded = () => {
        if (audioRef.current) {
            setLocalDur(audioRef.current.duration);
            dispatch(setDuration(audioRef.current.duration));
        }
    };

    const onEnded = () => {
        const idx = queue.findIndex((s) => s._id === currentSong?._id);
        if (idx >= 0 && idx < queue.length - 1) {
            dispatch(setCurrentSong(queue[idx + 1]));
            dispatch(playSong());
        } else {
            dispatch(pauseSong());
        }
    };

    const seek = (e) => {
        const v = parseFloat(e.target.value);
        setLocalTime(v);
        if (audioRef.current) audioRef.current.currentTime = v;
        setSeeking(false);
    };

    const prev = () => {
        if (audioRef.current?.currentTime > 3) { audioRef.current.currentTime = 0; return; }
        const idx = queue.findIndex((s) => s._id === currentSong?._id);
        if (idx > 0) { dispatch(setCurrentSong(queue[idx - 1])); dispatch(playSong()); }
    };

    const next = () => {
        const idx = queue.findIndex((s) => s._id === currentSong?._id);
        if (idx >= 0 && idx < queue.length - 1) {
            dispatch(setCurrentSong(queue[idx + 1]));
            dispatch(playSong());
        }
    };

    const pct = localDur > 0 ? (localTime / localDur) * 100 : 0;
    const qIdx = queue.findIndex((s) => s._id === currentSong?._id);

    const barStyle = {
        flexShrink: 0,
        borderRadius: 14,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: "rgba(14,18,28,0.97)",
        border: "1px solid rgba(34,211,238,0.12)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
    };

    // ── No song: placeholder bar ───────────────────────────────────
    if (!currentSong) {
        return (
            <>
                <audio ref={audioRef} />
                <div style={barStyle}>
                    {/* Left: empty slot */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, width: 220, flexShrink: 0 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Music2 size={18} color="#1E2940" />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>No track selected</p>
                            <p style={{ fontSize: 11, color: "#1E2940", marginTop: 2 }}>Pick a song to play</p>
                        </div>
                    </div>

                    {/* Center: disabled controls */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.25 }}>
                            <SkipBack size={18} color="#64748B" fill="#64748B" />
                            <div style={{
                                width: 40, height: 40, borderRadius: "50%", border: "none",
                                background: "rgba(34,211,238,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Play size={17} fill="#64748B" color="#64748B" style={{ marginLeft: 2 }} />
                            </div>
                            <SkipForward size={18} color="#64748B" fill="#64748B" />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 480, opacity: 0.2 }}>
                            <span style={{ fontSize: 10, color: "#475569", width: 32, textAlign: "right" }}>0:00</span>
                            <div style={{ flex: 1, height: 3, borderRadius: 9999, background: "#1E2433" }} />
                            <span style={{ fontSize: 10, color: "#475569", width: 32 }}>0:00</span>
                        </div>
                    </div>

                    {/* Right: volume placeholder */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: 160, flexShrink: 0, justifyContent: "flex-end", opacity: 0.25 }}>
                        <Volume2 size={17} color="#475569" />
                        <div style={{ height: 3, width: 90, borderRadius: 9999, background: "#1E2433" }} />
                    </div>
                </div>
            </>
        );
    }

    // ── Active player ──────────────────────────────────────────────
    return (
        <>
            <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoaded} onEnded={onEnded} />

            <div style={barStyle}>
                {/* Song info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, width: 220, flexShrink: 0 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #164E63, #083344)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {currentSong.imageUrl ? (
                            <img src={currentSong.imageUrl} alt={currentSong.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : isPlaying ? (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} style={{
                                        width: 2.5, borderRadius: 1, background: "#22D3EE",
                                        transformOrigin: "bottom",
                                        animation: `equalizer ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                                        height: `${5 + i * 3}px`,
                                    }} />
                                ))}
                            </div>
                        ) : <Music2 size={18} color="#22D3EE" />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {currentSong.title}
                        </p>
                        <p style={{ fontSize: 11, color: "#475569", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {currentSong.artist?.username || "Unknown"}
                        </p>
                    </div>
                </div>

                {/* Center controls */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <button onClick={prev} disabled={qIdx <= 0}
                            style={{ background: "none", border: "none", cursor: qIdx <= 0 ? "not-allowed" : "pointer", opacity: qIdx <= 0 ? 0.3 : 1, color: "#94A3B8" }}
                            onMouseEnter={(e) => { if (qIdx > 0) e.currentTarget.style.color = "#F1F5F9"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                        >
                            <SkipBack size={18} fill="currentColor" />
                        </button>

                        <button
                            onClick={() => dispatch(isPlaying ? pauseSong() : playSong())}
                            style={{
                                width: 40, height: 40, borderRadius: "50%", border: "none",
                                background: "linear-gradient(135deg, #22D3EE, #0891B2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all 0.15s ease",
                                boxShadow: "0 4px 16px rgba(34,211,238,0.35)",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                        >
                            {isPlaying
                                ? <Pause size={17} fill="white" color="white" />
                                : <Play size={17} fill="white" color="white" style={{ marginLeft: 2 }} />}
                        </button>

                        <button onClick={next} disabled={qIdx >= queue.length - 1}
                            style={{ background: "none", border: "none", cursor: qIdx >= queue.length - 1 ? "not-allowed" : "pointer", opacity: qIdx >= queue.length - 1 ? 0.3 : 1, color: "#94A3B8" }}
                            onMouseEnter={(e) => { if (qIdx < queue.length - 1) e.currentTarget.style.color = "#F1F5F9"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                        >
                            <SkipForward size={18} fill="currentColor" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 480 }}>
                        <span style={{ fontSize: 10, color: "#475569", width: 32, textAlign: "right" }}>{fmt(localTime)}</span>
                        <div style={{ flex: 1, position: "relative" }}>
                            <div style={{ height: 3, width: "100%", borderRadius: 9999, background: "#1E2433", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #22D3EE, #0891B2)", borderRadius: 9999, transition: "width 0.1s linear" }} />
                            </div>
                            <input type="range" min={0} max={localDur || 0} step={0.5} value={localTime}
                                onMouseDown={() => setSeeking(true)}
                                onTouchStart={() => setSeeking(true)}
                                onChange={seek}
                                style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer" }}
                            />
                        </div>
                        <span style={{ fontSize: 10, color: "#475569", width: 32 }}>{fmt(localDur)}</span>
                    </div>
                </div>

                {/* Volume */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: 160, flexShrink: 0, justifyContent: "flex-end" }}>
                    <button onClick={() => dispatch(setVolume(volume > 0 ? 0 : 1))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                    >
                        {volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>
                    <div style={{ position: "relative", width: 90 }}>
                        <div style={{ height: 3, width: "100%", borderRadius: 9999, background: "#1E2433" }}>
                            <div style={{ height: "100%", width: `${volume * 100}%`, background: "#22D3EE", borderRadius: 9999 }} />
                        </div>
                        <input type="range" min={0} max={1} step={0.02} value={volume}
                            onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
                            style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer" }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerBar;
