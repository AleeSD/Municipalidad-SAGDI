export default function Tramites({
  filtered,
  searchQ,
  setSearchQ,
  filterPrio,
  setFilterPrio,
  filterArea,
  setFilterArea,
  areas,
  selectedTramite,
  setSelectedTramite,
  updateEstado,
  ESTADOS,
  cardStyle,
  inputStyle,
  COLORS,
  Badge,
}) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Gestión de Trámites</h1>
          <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>Módulo 3 — Gateway de Alertas · Actualización de estados en tiempo real</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          style={{ ...inputStyle, maxWidth: 260 }}
          placeholder="🔍 Buscar por ID, nombre o DNI..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        <select style={{ ...inputStyle, maxWidth: 160 }} value={filterPrio} onChange={(e) => setFilterPrio(e.target.value)}>
          {["Todos", "Alta", "Media", "Baja"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select style={{ ...inputStyle, maxWidth: 220 }} value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
          {areas.map((a) => <option key={a}>{a}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.muted }}>
          <span>{filtered.length} resultado(s)</span>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.navyLight }}>
              {[
                "ID",
                "Ciudadano / DNI",
                "Tipo de Trámite",
                "Área",
                "Prioridad ML",
                "Estado",
                "Fecha",
                "Actualizar Estado",
              ].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: COLORS.muted, fontWeight: 700, letterSpacing: 0.5, borderBottom: `1px solid ${COLORS.border}` }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="row-hover"
                style={{ borderBottom: `1px solid ${COLORS.border}11`, background: selectedTramite?.id === t.id ? "#1E90FF11" : "transparent" }}
                onClick={() => setSelectedTramite(t.id === selectedTramite?.id ? null : t)}
              >
                <td style={{ padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.accent, fontWeight: 700 }}>{t.id}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.ciudadano}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>DNI: {t.dni}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, maxWidth: 180 }}>
                  <div style={{ color: COLORS.text }}>{t.tipo}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.muted }}>{t.area}</td>
                <td style={{ padding: "12px 16px" }}><Badge label={t.prioridad} /></td>
                <td style={{ padding: "12px 16px" }}><Badge label={t.estado} /></td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.muted }}>{t.fecha}</td>
                <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                  <select
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: 12, maxWidth: 160 }}
                    value={t.estado}
                    onChange={(e) => updateEstado(t.id, e.target.value)}
                  >
                    {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No se encontraron trámites.</div>
        )}
      </div>

      {selectedTramite && (
        <div style={{ ...cardStyle, marginTop: 20, borderColor: COLORS.accent, animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>📄 Detalle del Trámite — {selectedTramite.id}</div>
            <button onClick={() => setSelectedTramite(null)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, marginBottom: 4 }}>DESCRIPCIÓN ORIGINAL</div>
            <div style={{ fontSize: 13, color: COLORS.text, background: COLORS.navyLight, borderRadius: 8, padding: "10px 14px" }}>{selectedTramite.descripcion}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, marginBottom: 8 }}>HISTORIAL DE ALERTAS ENVIADAS (GATEWAY)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selectedTramite.alertas.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, background: "#1E90FF22", border: "1px solid #1E90FF44", color: COLORS.accent, borderRadius: 6, padding: "3px 10px" }}>
                    📬 {a}
                  </span>
                  {i < selectedTramite.alertas.length - 1 && <span style={{ color: COLORS.border }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
