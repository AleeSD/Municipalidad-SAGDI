import { useState, useEffect, useRef } from "react";
import { nlpClassify, predictPriority, generateId } from "./sagdi-app/src/utils/mlUtils";
import { AREAS, TRAMITES_TIPOS, ESTADOS, initialTramites } from "./sagdi-app/src/data/mockData";
import { COLORS } from "./sagdi-app/src/styles/theme";
import Notification from "./sagdi-app/src/components/Notification";
import Badge from "./sagdi-app/src/components/Badge";
import Dashboard from "./sagdi-app/src/pages/Dashboard";
import MesaDePartes from "./sagdi-app/src/pages/MesaDePartes";

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function SAGDI() {
  const [tab, setTab] = useState("dashboard");
  const [tramites, setTramites] = useState(initialTramites);
  const [notifs, setNotifs] = useState([]);
  const [form, setForm] = useState({ ciudadano: "", dni: "", descripcion: "" });
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterPrio, setFilterPrio] = useState("Todos");
  const [filterArea, setFilterArea] = useState("Todos");
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [statsAnim, setStatsAnim] = useState(false);

  const notifRef = useRef(0);

  useEffect(() => {
    setTimeout(() => setStatsAnim(true), 100);
  }, []);

  const pushNotif = (tramiteId, mensaje) => {
    const id = ++notifRef.current;
    setNotifs((n) => [...n, { id, tramiteId, mensaje }]);
    setTimeout(() => setNotifs((n) => n.filter((x) => x.id !== id)), 6000);
  };

  const closeNotif = (id) => setNotifs((n) => n.filter((x) => x.id !== id));

  const handleSubmit = () => {
    if (!form.ciudadano || !form.dni || !form.descripcion) return;
    setProcessing(true);
    setLastResult(null);
    setTimeout(() => {
      const tipo = nlpClassify(form.descripcion);
      const prioridad = predictPriority(tipo, form.descripcion);
      const area = AREAS[tipo] || "Mesa de Partes";
      const id = generateId();
      const nuevo = {
        id, ciudadano: form.ciudadano, dni: form.dni, tipo, area,
        prioridad, estado: "Recibido",
        fecha: new Date().toISOString().split("T")[0],
        descripcion: form.descripcion, alertas: ["Recibido"]
      };
      setTramites((t) => [nuevo, ...t]);
      setLastResult(nuevo);
      setProcessing(false);
      setForm({ ciudadano: "", dni: "", descripcion: "" });
      pushNotif(id, `Estimado/a ${form.ciudadano}, su trámite ha sido clasificado con prioridad ${prioridad} y derivado a ${area}.`);
    }, 2200);
  };

  const updateEstado = (id, nuevoEstado) => {
    setTramites((t) => t.map((tr) => {
      if (tr.id !== id) return tr;
      const alertas = tr.alertas.includes(nuevoEstado) ? tr.alertas : [...tr.alertas, nuevoEstado];
      return { ...tr, estado: nuevoEstado, alertas };
    }));
    const tr = tramites.find((t) => t.id === id);
    if (tr) pushNotif(id, `Trámite N° ${id} actualizado: "${nuevoEstado}". Área: ${tr.area}.`);
  };

  const filtered = tramites.filter((t) => {
    const q = searchQ.toLowerCase();
    const matchQ = !q || t.id.toLowerCase().includes(q) || t.ciudadano.toLowerCase().includes(q) || t.dni.includes(q);
    const matchP = filterPrio === "Todos" || t.prioridad === filterPrio;
    const matchA = filterArea === "Todos" || t.area === filterArea;
    return matchQ && matchP && matchA;
  });

  const stats = {
    total: tramites.length,
    alta: tramites.filter((t) => t.prioridad === "Alta").length,
    pendientes: tramites.filter((t) => !["Listo para Recoger", "Aprobado"].includes(t.estado)).length,
    listos: tramites.filter((t) => t.estado === "Listo para Recoger").length,
  };

  const areas = ["Todos", ...new Set(tramites.map((t) => t.area))];

  // ── STYLES ─────────────────────────────────────────────────────────
  const navStyle = (active) => ({
    background: active ? COLORS.accent : "transparent",
    border: "none", color: active ? "#fff" : COLORS.muted,
    borderRadius: 8, padding: "9px 18px", cursor: "pointer",
    fontWeight: active ? 700 : 500, fontSize: 13,
    transition: "all 0.2s", letterSpacing: 0.3,
    display: "flex", alignItems: "center", gap: 7
  });

  const cardStyle = {
    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 14, padding: "22px 24px"
  };

  const inputStyle = {
    width: "100%", background: COLORS.navyLight, border: `1px solid ${COLORS.border}`,
    color: COLORS.text, borderRadius: 10, padding: "11px 14px",
    fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit"
  };

  const btnStyle = (variant = "primary") => ({
    background: variant === "primary" ? COLORS.accent : variant === "success" ? COLORS.success : COLORS.surface,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    color: "#fff", borderRadius: 10, padding: "11px 22px", cursor: "pointer",
    fontWeight: 700, fontSize: 14, transition: "all 0.2s", fontFamily: "inherit"
  });

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.navy, color: COLORS.text,
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #0B1F3A; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
        @keyframes slideIn { from { opacity:0; transform:translateX(30px);} to { opacity:1; transform:translateX(0);} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px #1E90FF22; }
        .row-hover:hover { background: #1A356022 !important; cursor:pointer; }
        .btn-hover:hover { filter: brightness(1.12); transform: translateY(-1px); }
        textarea:focus, input:focus { border-color: #1E90FF !important; }
      `}</style>

      <Notification notifs={notifs} onClose={closeNotif} />

      {/* ── HEADER ── */}
      <div style={{
        background: COLORS.navyLight, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 32px", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.accent}, #0050CC)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#fff"
            }}>S</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, letterSpacing: 0.5 }}>SAGDI</div>
              <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 0.8 }}>MUNICIPALIDAD PROVINCIAL DE YAU</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { id: "dashboard", icon: "⬛", label: "Dashboard" },
              { id: "mesapartes", icon: "📥", label: "Mesa de Partes" },
              { id: "tramites", icon: "📋", label: "Trámites" },
              { id: "arquitectura", icon: "🏗️", label: "Arquitectura" },
            ].map((t) => (
              <button key={t.id} style={navStyle(tab === t.id)} onClick={() => setTab(t.id)} className="btn-hover">
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#00C48C22", border: "1px solid #00C48C44",
            borderRadius: 8, padding: "5px 12px"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.success, display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: COLORS.success, fontWeight: 600 }}>Sistema Activo</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>

        {/* ══ DASHBOARD ══════════════════════════════════════════════ */}
        {tab === "dashboard" && (
          <Dashboard
            stats={stats}
            statsAnim={statsAnim}
            tramites={tramites}
            cardStyle={cardStyle}
            COLORS={COLORS}
            Badge={Badge}
          />
        )}

        {/* ══ MESA DE PARTES ═══════════════════════════════════════ */}
        {tab === "mesapartes" && (
          <MesaDePartes
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            processing={processing}
            lastResult={lastResult}
            cardStyle={cardStyle}
            inputStyle={inputStyle}
            btnStyle={btnStyle}
            COLORS={COLORS}
            Badge={Badge}
          />
        )}

        {/* ══ TRAMITES ════════════════════════════════════════════════ */}
        {tab === "tramites" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Gestión de Trámites</h1>
                <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>Módulo 3 — Gateway de Alertas · Actualización de estados en tiempo real</p>
              </div>
            </div>

            {/* Filtros */}
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

            {/* Tabla */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.navyLight }}>
                    {["ID", "Ciudadano / DNI", "Tipo de Trámite", "Área", "Prioridad ML", "Estado", "Fecha", "Actualizar Estado"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: COLORS.muted, fontWeight: 700, letterSpacing: 0.5, borderBottom: `1px solid ${COLORS.border}` }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
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

            {/* Detalle trámite */}
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
        )}

        {/* ══ ARQUITECTURA ════════════════════════════════════════════ */}
        {tab === "arquitectura" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Arquitectura del Sistema</h1>
              <p style={{ color: COLORS.muted, margin: "6px 0 0", fontSize: 14 }}>Diagrama técnico SAGDI — FastAPI · PostgreSQL · ML Pipeline · Ley N° 29733</p>
            </div>

            {/* Módulos */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
              {[
                {
                  num: "01", title: "Mesa de Partes Digital", sub: "NLP Classifier",
                  color: COLORS.accent, icon: "🤖",
                  items: ["Modelo: Clasificación de Texto (TF-IDF + Naive Bayes / BERT)", "Input: Descripción libre del ciudadano", "Output: Tipo de trámite + Área de derivación", "Precisión objetivo: ≥ 92% en datos históricos"],
                  tech: ["scikit-learn", "spaCy", "FastAPI POST /procesar"]
                },
                {
                  num: "02", title: "Motor Predictivo", sub: "Priorización Crítica",
                  color: COLORS.danger, icon: "🧠",
                  items: ["Modelo: Árbol de Decisión / Random Forest supervisado", "Features: tipo, plazo legal, demanda histórica, urgencia", "Output: Etiqueta Alta / Media / Baja", "Entrenado con datos históricos anonimizados"],
                  tech: ["RandomForestClassifier", "joblib serialization", "API /prioridad"]
                },
                {
                  num: "03", title: "Gateway de Alertas", sub: "Notificaciones Automáticas",
                  color: COLORS.success, icon: "📬",
                  items: ["Trigger: Cambio de estado en PostgreSQL", "Canales: SMS (Twilio) + Email (SMTP)", "Mensaje estructurado con ID + Área + Prioridad", "Tiempo real — 0 intervención manual"],
                  tech: ["Twilio API", "smtplib SMTP", "PostgreSQL triggers"]
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
                        background: `${m.color}18`, border: `1px solid ${m.color}44`,
                        color: m.color, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace"
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stack técnico */}
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
                  background: COLORS.navy, borderRadius: 10, padding: "16px",
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 2,
                  color: COLORS.text
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

            {/* Garantías */}
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
        )}

      </div>
    </div>
  );
}
