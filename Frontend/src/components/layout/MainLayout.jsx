import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PlayerBar from "../player/PlayerBar";

/*
 * Layout structure (nothing scrolls at the page level):
 *
 *  <outer-shell>          ← 100vh, overflow:hidden, padding:20px, bg:#0C0E14
 *    <app-frame>          ← flex-row, flex:1, overflow:hidden, rounded
 *      <Sidebar />        ← w:220px, overflow-y:auto (independently scrollable)
 *      <content-col>      ← flex-col, flex:1, overflow:hidden
 *        <Navbar />       ← fixed height, never shrinks
 *        <main />         ← flex:1, overflow-y:auto (independently scrollable)
 *    <PlayerBar />        ← always visible, fixed height, never shrinks
 */
const MainLayout = ({ children }) => {
    return (
        <div
            style={{
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                gap: "12px",
                background: "#0C0E14",
            }}
        >
            {/* ── App frame ────────────────────────────────────── */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#111520",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 24px 80px rgba(0,0,0,0.5)",
                    minHeight: 0, // critical for flex children to shrink properly
                }}
            >
                {/* Sidebar — independently scrollable */}
                <Sidebar />

                {/* Content column */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    {/* Navbar — fixed height */}
                    <Navbar />

                    {/* Main content — independently scrollable */}
                    <main
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            minHeight: 0, // critical
                        }}
                    >
                        <div
                            style={{
                                maxWidth: 1200,
                                margin: "0 auto",
                                padding: "36px 44px",
                            }}
                        >
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* ── Player bar — always visible at bottom ───────── */}
            <PlayerBar />
        </div>
    );
};

export default MainLayout;