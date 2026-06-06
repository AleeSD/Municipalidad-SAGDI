import StatCard from "../components/StatCard";

export default function Dashboard({ stats, statsAnim, tramites, cardStyle, COLORS, Badge }) {
  const statItems = [
    { label: "Total de trámites", value: stats.total, color: COLORS.accent, sub: "Registrados en el sistema" },
    { label: "Prioridad alta", value: stats.alta, color: COLORS.danger, sub: "Requieren atención inmediata" },
    { label: "En proceso", value: stats.pendientes, color: COLORS.warning, sub: "Pendientes de resolución" },
    { label: "Listos para recoger", value: stats.listos, color: COLORS.success, sub: "Aprobados y listos" },
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
        <p style={{ color: COLORS.textMuted, margin: "6px 0 0", fontSize: 14 }}>
          Resumen operativo del sistema de gestión documental institucional.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 28 }}>
        {statItems.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            color={s.color}
            sub={s.sub}
            statsAnim={statsAnim}
            delay={0.2 + i * 0.08}
            cardStyle={cardStyle}
          />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 14 }}>Distribución por prioridad</div>
          {priorityItems.map((p) => (
            <div key={p.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{p.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.count} trámites</span>
              </div>
              <div style={{ height: 8, background: COLORS.surfaceLight, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${stats.total ? (p.count / stats.total) * 100 : 0}%`,
                  background: p.color,
                  borderRadius: 4,
                  transition: "width 1s ease",
                  boxShadow: `0 0 10px ${p.color}22`,
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 14 }}>Distribución por área</div>
          {areaEntries.map(([area, count], i) => (
            <div key={area} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: COLORS.textMuted, flex: 1 }}>{area}</span>
              <div style={{ width: 100, height: 6, background: COLORS.surfaceLight, borderRadius: 3, margin: "0 12px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(count / tramites.length) * 100}%`,
                  background: [COLORS.accent, COLORS.gold, COLORS.success, COLORS.warning][i % 4],
                  borderRadius: 3,
                  transition: "width 1s ease",
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, minWidth: 16 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Actividad reciente</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {tramites.slice(0, 4).map((t) => (
            <div key={t.id} style={{ background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: COLORS.accent, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{t.id}</span>
                <Badge label={t.prioridad} />
              </div>
              <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}>{t.ciudadano}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.tipo}</div>
              <div style={{ marginTop: 12 }}><Badge label={t.estado} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
