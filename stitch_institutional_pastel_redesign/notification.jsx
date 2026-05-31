import { COLORS } from "../styles/theme";

const Notification = ({ notifs, onClose }) => (
    <div style={{
        position: "fixed", top: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 10, maxWidth: 340
    }}>
        {notifs.map((n) => (
        <div key={n.id} style={{
            background: "#0F2545", border: `1px solid ${COLORS.accent}`,
            borderRadius: 12, padding: "14px 18px", boxShadow: `0 4px 24px #1E90FF33`,
            animation: "slideIn 0.3s ease"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
                <div style={{ color: COLORS.accentGlow, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                📬 ALERTA SAGDI — {n.tramiteId}
                </div>
                <div style={{ color: COLORS.text, fontSize: 13 }}>{n.mensaje}</div>
            </div>
            <button onClick={() => onClose(n.id)} style={{
                background: "none", border: "none", color: COLORS.muted,
                cursor: "pointer", fontSize: 16, marginLeft: 12, padding: 0
            }}>✕</button>
            </div>
        </div>
        ))}
    </div>
    );

export default Notification;
