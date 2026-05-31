    export default function StatCard({ label, value, icon, color, sub, statsAnim, delay, cardStyle }) {
    return (
        <div className="stat-card" style={{
        ...cardStyle,
        borderTop: `3px solid ${color}`,
        animation: `fadeUp ${delay}s ease`
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
            <div style={{ fontSize: 12, color: "#8BA3C4", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
                {label.toUpperCase()}
            </div>
            <div style={{ fontSize: 38, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
                {statsAnim ? value : 0}
            </div>
            <div style={{ fontSize: 11, color: "#758199", marginTop: 6 }}>{sub}</div>
            </div>
            <div style={{ fontSize: 26 }}>{icon}</div>
        </div>
        </div>
    );
    }