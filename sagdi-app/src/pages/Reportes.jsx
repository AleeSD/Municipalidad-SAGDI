function Reportes({ stats, tramites, cardStyle, COLORS, downloadReport }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ ...cardStyle, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 8, fontSize: 15 }}>Reportes operativos</div>
            <h2 style={{ margin: 0, fontSize: 28, color: COLORS.text }}>Métricas del ciclo de trámites</h2>
            <p style={{ maxWidth: 620, color: COLORS.textMuted, marginTop: 10, lineHeight: 1.7 }}>
              Exporta las métricas clave del sistema y revisa los indicadores de flujo de trabajo para Mesa de Partes.
            </p>
          </div>
          <button style={{ background: COLORS.accent, color: "#fff", border: "none", borderRadius: 14, padding: "14px 22px", cursor: "pointer", fontWeight: 700 }} onClick={downloadReport}>
            Descargar reporte CSV
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
        {[
          { label: "Total de trámites", value: stats.total, color: COLORS.text },
          { label: "Prioridad alta", value: stats.alta, color: COLORS.warning },
          { label: "Trámites listos", value: stats.listos, color: COLORS.success },
        ].map((item) => (
          <div key={item.label} style={{ ...cardStyle, padding: 20, borderRadius: 20, minHeight: 130 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.1 }}>{item.label}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: 28 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: COLORS.text }}>Últimos trámites registrados</div>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ background: COLORS.surfaceLight }}>
                {["ID", "Ciudadano", "Tipo", "Área", "Prioridad", "Estado", "Fecha"].map((col) => (
                  <th key={col} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tramites.slice(0, 6).map((tramite) => (
                <tr key={tramite.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.id}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.ciudadano}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.tipo}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.area}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.prioridad}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.estado}</td>
                  <td style={{ padding: "14px 16px", color: COLORS.text }}>{tramite.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
