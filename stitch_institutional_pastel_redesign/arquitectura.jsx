    export default function Arquitectura({ cardStyle, COLORS }) {
    return (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
        <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Arquitectura del Sistema</h1>
            <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>Diagrama técnico SAGDI — FastAPI · PostgreSQL · ML Pipeline · Ley N° 29733</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
            {[
            {
                num: "01",
                title: "Mesa de Partes Digital",
                sub: "NLP Classifier",
                color: COLORS.accent,
                icon: "🤖",
                items: [
                "Modelo: Clasificación de Texto (TF-IDF + Naive Bayes / BERT)",
                "Input: Descripción libre del ciudadano",
                "Output: Tipo de trámite + Área de derivación",
                "Precisión objetivo: ≥ 92% en datos históricos",
                ],
                tech: ["scikit-learn", "spaCy", "FastAPI POST /procesar"],
            },
            {
                num: "02",
                title: "Motor Predictivo",
                sub: "Priorización Crítica",
                color: COLORS.danger,
                icon: "🧠",
                items: [
                "Modelo: Árbol de Decisión / Random Forest supervisado",
                "Features: tipo, plazo legal, demanda histórica, urgencia",
                "Output: Etiqueta Alta / Media / Baja",
                "Entrenado con datos históricos anonimizados",
                ],
                tech: ["RandomForestClassifier", "joblib serialization", "API /prioridad"],
            },
            {
                num: "03",
                title: "Gateway de Alertas",
                sub: "Notificaciones Automáticas",
                color: COLORS.success,
                icon: "📬",
                items: [
                "Trigger: Cambio de estado en PostgreSQL",
                "Canales: SMS (Twilio) + Email (SMTP)",
                "Mensaje estructurado con ID + Área + Prioridad",
                "Tiempo real — 0 intervención manual",
                ],
                tech: ["Twilio API", "smtplib SMTP", "PostgreSQL triggers"],
            },
            ].map((m) => (
            <div key={m.num} style={{ ...cardStyle, borderTop: `3px solid ${m.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 10, color: m.color, fontWeight: 700, letterSpacing: 1 }}>MÓDULO {m.num}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{m.sub}</div>
                </div>
                <div style={{ fontSize: 28 }}>{m.icon}</div>
                </div>
                <ul style={{ padding: "0 0 0 16px", margin: "0 0 14px", color: COLORS.muted, fontSize: 12, lineHeight: 1.8 }}>
                {m.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {m.tech.map((t) => (
                    <span key={t} style={{
                    background: `${m.color}18`,
                    border: `1px solid ${m.color}44`,
                    color: m.color,
                    borderRadius: 5,
                    padding: "2px 8px",
                    fontSize: 10,
                    fontFamily: "'IBM Plex Mono', monospace",
                    }}>{t}</span>
                ))}
                </div>
            </div>
            ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>🏗️ Stack Técnico</div>
            {[
                { layer: "Backend API", tech: "FastAPI + Uvicorn", color: COLORS.accent },
                { layer: "ML Models", tech: "scikit-learn + joblib", color: COLORS.gold },
                { layer: "Base de Datos", tech: "PostgreSQL / Supabase", color: COLORS.success },
                { layer: "Alertas", tech: "Twilio + SMTP", color: COLORS.warning },
                { layer: "Datos", tech: "pandas + anonimización (Ley 29733)", color: COLORS.danger },
                { layer: "Entorno", tech: "Python venv + .env secrets", color: COLORS.muted },
            ].map((s) => (
                <div key={s.layer} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, padding: "8px 12px", background: COLORS.navyLight, borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.muted }}>{s.layer}</span>
                <span style={{ fontSize: 12, color: s.color, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>{s.tech}</span>
                </div>
            ))}
            </div>

            <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>📐 Estructura del Proyecto</div>
            <div style={{
                background: COLORS.navy,
                borderRadius: 10,
                padding: "16px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                lineHeight: 2,
                color: COLORS.text,
            }}>
                {[
                ["📁", "municipalidad-ml/", COLORS.gold],
                ["📁", "  data/", COLORS.accent],
                ["📁", "  models/", COLORS.accent],
                ["📁", "  app/", COLORS.accent],
                ["📄", "    main.py", COLORS.success],
                ["📄", "    ml_utils.py", COLORS.success],
                ["📄", "    notifier.py", COLORS.warning],
                ["📄", "  .env", COLORS.danger],
                ["📄", "  requirements.txt", COLORS.muted],
                ].map(([icon, name, color], i) => (
                <div key={i} style={{ color }}>{icon} {name}</div>
                ))}
            </div>
            </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ ...cardStyle, borderColor: COLORS.success }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: COLORS.success }}>⚖️ Cumplimiento Legal</div>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>
                El pipeline aplica <strong style={{ color: COLORS.text }}>anonimización estricta</strong> de datos históricos antes del entrenamiento del modelo, cumpliendo la <strong style={{ color: COLORS.text }}>Ley N° 29733</strong> de Protección de Datos Personales del Perú. Los modelos no almacenan información personal identificable.
            </p>
            </div>
            <div style={{ ...cardStyle, borderColor: COLORS.accent }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: COLORS.accent }}>📈 Escalabilidad</div>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>
                Arquitectura <strong style={{ color: COLORS.text }}>API REST con FastAPI</strong> sobre infraestructura existente. Compatible con PostgreSQL y Supabase para escalar horizontalmente. El diseño modular permite incorporar nuevos modelos ML sin rediseñar el sistema.
            </p>
            </div>
        </div>
        </div>
    );
    }
