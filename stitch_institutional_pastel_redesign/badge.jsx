    // ─── COMPONENTS ─────────────────────────────────────────────────────

    const Badge = ({ label }) => {
    const map = {
        Alta: { bg: "#FF4D6D22", border: "#FF4D6D", text: "#FF4D6D" },
        Media: { bg: "#FFB54722", border: "#FFB547", text: "#FFB547" },
        Baja: { bg: "#00C48C22", border: "#00C48C", text: "#00C48C" },
        "En Revisión": { bg: "#1E90FF22", border: "#1E90FF", text: "#1E90FF" },
        Recibido: { bg: "#8FA3BF22", border: "#8FA3BF", text: "#8FA3BF" },
        Observado: { bg: "#FFB54722", border: "#FFB547", text: "#FFB547" },
        Aprobado: { bg: "#00C48C22", border: "#00C48C", text: "#00C48C" },
        "Listo para Recoger": { bg: "#F5A62322", border: "#F5A623", text: "#F5A623" },
    };
    const c = map[label] || { bg: "#ffffff11", border: "#ffffff44", text: "#fff" };
    return (
        <span style={{
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700,
        letterSpacing: 0.5, whiteSpace: "nowrap"
        }}>{label}</span>
    );
    };

export default Badge;

    