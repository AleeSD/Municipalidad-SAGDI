export default function MesaDePartes({ form, setForm, handleSubmit, processing, lastResult, cardStyle, inputStyle, btnStyle, COLORS, Badge }) {
    const pipelineSteps = [
        { step: "Ingreso", desc: "Formulario digital", color: COLORS.accent },
        { step: "Clasificación NLP", desc: "Detecta el tipo de trámite", color: COLORS.gold },
        { step: "Priorización ML", desc: "Calcula la prioridad" , color: COLORS.danger },
        { step: "Derivación", desc: "Envía al área correspondiente", color: COLORS.success },
        { step: "Notificación", desc: "Notifica al ciudadano", color: COLORS.warning },
    ];

    return (
        <div style={{ animation: "fadeUp 0.4s ease", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Mesa de Partes Digital</h1>
            <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>
            Módulo 1 — Clasificación automática con NLP · Módulo 2 — Priorización predictiva
            </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 700, marginBottom: 14, letterSpacing: 0.8 }}>ML Pipeline</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {pipelineSteps.map((p, i) => (
                <div key={p.step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `${p.color}22`, border: `2px solid ${p.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, margin: "0 auto 8px"
                    }}></div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.step}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{p.desc}</div>
                </div>
                {i < pipelineSteps.length - 1 && <div style={{ width: 28, height: 2, background: COLORS.border, flexShrink: 0 }} />}
                </div>
            ))}
            </div>
        </div>

        <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Registro de nueva solicitud</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
                <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>NOMBRE DEL CIUDADANO</label>
                <input
                style={inputStyle} placeholder="Ej. María González Ruiz"
                value={form.ciudadano}
                onChange={(e) => setForm({ ...form, ciudadano: e.target.value })}
                />
            </div>
            <div>
                <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>DNI</label>
                <input
                style={inputStyle} placeholder="12345678"
                value={form.dni} maxLength={8}
                onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, "") })}
                />
            </div>
            </div>
            <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: COLORS.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>
                DESCRIPCIÓN DEL TRÁMITE <span style={{ color: COLORS.accent }}>(el NLP analizará este texto)</span>
            </label>
            <textarea
                style={{ ...inputStyle, height: 100, resize: "vertical" }}
                placeholder="Ej: Solicito licencia de construcción para ampliación de segundo piso en mi propiedad..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
            </div>
            <button
            className="btn-hover"
            style={{ ...btnStyle("primary"), width: "100%", fontSize: 15, padding: "14px" }}
            onClick={handleSubmit}
            disabled={processing}
            >
            {processing ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ width: 16, height: 16, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Procesando...
                </span>
            ) : "Procesar trámite"}
            </button>
        </div>

        {lastResult && (
            <div style={{
            ...cardStyle, marginTop: 20, borderColor: COLORS.success,
            animation: "fadeUp 0.4s ease"
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: COLORS.success }}>Trámite procesado exitosamente</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                { label: "ID asignado", value: lastResult.id, mono: true },
                { label: "Ciudadano", value: lastResult.ciudadano },
                { label: "Tipo (NLP)", value: lastResult.tipo },
                { label: "Área derivada", value: lastResult.area },
                ].map((f, i) => (
                <div key={i} style={{ background: COLORS.surfaceLight, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, marginBottom: 4 }}>{f.label.toUpperCase()}</div>
                    <div style={{ fontSize: 14, color: COLORS.text, fontFamily: f.mono ? "'IBM Plex Mono', monospace" : "inherit", fontWeight: f.mono ? 700 : 500 }}>
                    {f.value}
                    </div>
                </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1, background: COLORS.surfaceLight, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.muted }}>Prioridad</span>
                <Badge label={lastResult.prioridad} />
                </div>
                <div style={{ flex: 1, background: COLORS.surfaceLight, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.muted }}>Estado</span>
                <Badge label={lastResult.estado} />
                </div>
            </div>
            <div style={{ marginTop: 12, background: `${COLORS.success}18`, border: `1px solid ${COLORS.success}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: COLORS.success }}>
                Notificación enviada automáticamente al ciudadano
            </div>
            </div>
        )}
        </div>
    );
    }
