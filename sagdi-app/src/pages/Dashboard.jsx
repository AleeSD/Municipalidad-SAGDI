import StatCard from "../components/StatCard";

export default function Dashboard({ stats, statsAnim, tramites, cardStyle, COLORS, Badge }) {
  const statItems = [
    { label: "Total Trámites", value: stats.total, icon: "📁", color: COLORS.accent, sub: "Registrados en sistema" },
    { label: "Prioridad Alta", value: stats.alta, icon: "🔴", color: COLORS.danger, sub: "Requieren atención inmediata" },
    { label: "En Proceso", value: stats.pendientes, icon: "⚙️", color: COLORS.warning, sub: "Pendientes de resolución" },
    { label: "Listos", value: stats.listos, icon: "✅", color: COLORS.success, sub: "Para recoger / Aprobados" },
  ];

  const priorityItems = [
    { label: "Alta", count: stats.alta, color: COLORS.danger },
    { label: "Media", count: tramites.filter((t) => t.prioridad === "Media").length, color: COLORS.warning },
    { label: "Baja", count: tramites.filter((t) => t.prioridad === "Baja").length, color: COLORS.success },
  ];

  const areaEntries = Object.entries(
    tramites.reduce((acc, t) => ({ ...acc, [t.area]: (acc[t.area] || 0) + 1 }), {})
  );

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: COLORS.text }}>Panel de Control</h1>
        <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>
          Sistema Automatizado de Gestión Documental Inteligente — ML Pipeline Activo
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {statItems.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            sub={s.sub}
            statsAnim={statsAnim}
            delay={0.2 + i * 0.08}
            cardStyle={cardStyle}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 14 }}>Distribución por Prioridad (ML Predictor)</div>
          {priorityItems.map((p) => (
            <div key={p.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: COLORS.muted }}>{p.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.count} trámites</span>
              </div>
              <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${stats.total ? (p.count / stats.total) * 100 : 0}%`,
                  background: p.color,
                  borderRadius: 4,
                  transition: "width 1s ease",
                  boxShadow: `0 0 8px ${p.color}88`
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 14 }}>Distribución por Área (NLP Classifier)</div>
          {areaEntries.map(([area, count], i) => (
            <div key={area} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: COLORS.muted, flex: 1 }}>{area}</span>
              <div style={{ width: 100, height: 6, background: COLORS.border, borderRadius: 3, margin: "0 12px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(count / tramites.length) * 100}%`,
                  background: [COLORS.accent, COLORS.gold, COLORS.success, COLORS.warning][i % 4],
                  borderRadius: 3,
                  transition: "width 1s ease"
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, minWidth: 16 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🔔</span> Gateway de Notificaciones — Actividad Reciente
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tramites.slice(0, 4).map((t) => (
            <div key={t.id} style={{
              background: COLORS.navyLight, border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: "12px 16px", flex: "1 1 220px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: COLORS.accent, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{t.id}</span>
                <Badge label={t.prioridad} />
              </div>
              <div style={{ fontSize: 12, color: COLORS.text, marginBottom: 4 }}>{t.ciudadano}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{t.tipo}</div>
              <div style={{ marginTop: 8 }}><Badge label={t.estado} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
