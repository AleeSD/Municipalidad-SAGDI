import { useEffect, useRef, useState } from "react";
import Dashboard from "./pages/Dashboard";
import MesaDePartes from "./pages/MesaDePartes";
import Tramites from "./pages/Tramites";
import Arquitectura from "./pages/Arquitectura";
import Notification from "./components/Notification";
import Badge from "./components/Badge";
import { nlpClassify, predictPriority, generateId, initialTramites, AREAS, ESTADOS } from "./utils/mlUtils";
import { COLORS } from "./styles/theme";

function App() {
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

    const currentForm = { ...form };
    setTimeout(() => {
      const tipo = nlpClassify(currentForm.descripcion);
      const prioridad = predictPriority(tipo, currentForm.descripcion);
      const area = AREAS[tipo] || "Mesa de Partes";
      const id = generateId();
      const nuevo = {
        id,
        ciudadano: currentForm.ciudadano,
        dni: currentForm.dni,
        tipo,
        area,
        prioridad,
        estado: "Recibido",
        fecha: new Date().toISOString().split("T")[0],
        descripcion: currentForm.descripcion,
        alertas: ["Recibido"],
      };

      setTramites((t) => [nuevo, ...t]);
      setLastResult(nuevo);
      setProcessing(false);
      setForm({ ciudadano: "", dni: "", descripcion: "" });
      pushNotif(id, `Estimado/a ${currentForm.ciudadano}, su trámite ha sido clasificado con prioridad ${prioridad} y derivado a ${area}.`);
    }, 2200);
  };

  const updateEstado = (id, nuevoEstado) => {
    setTramites((prev) => {
      const next = prev.map((tr) => {
        if (tr.id !== id) return tr;
        const alertas = tr.alertas.includes(nuevoEstado) ? tr.alertas : [...tr.alertas, nuevoEstado];
        return { ...tr, estado: nuevoEstado, alertas };
      });

      const updated = next.find((t) => t.id === id);
      if (updated) {
        pushNotif(id, `Trámite N° ${id} actualizado: "${nuevoEstado}". Área: ${updated.area}.`);
        if (selectedTramite?.id === id) {
          setSelectedTramite(updated);
        }
      }

      return next;
    });
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

  const navStyle = (active) => ({
    background: active ? COLORS.navy : "transparent",
    border: "none",
    color: active ? COLORS.text : COLORS.muted,
    borderRadius: 14,
    padding: "12px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: active ? 700 : 600,
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s ease",
  });

  const cardStyle = {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 18,
    padding: "26px",
    boxShadow: "0 14px 45px rgba(0, 0, 0, 0.08)",
  };

  const inputStyle = {
    width: "100%",
    background: COLORS.navyLight,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const btnStyle = (variant = "primary") => ({
    background: variant === "primary" ? COLORS.accent : variant === "success" ? COLORS.success : COLORS.surface,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    color: "#fff",
    borderRadius: 12,
    padding: "13px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s ease",
  });

  const pages = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "mesapartes", label: "Mesa de Partes", icon: "📥" },
    { id: "tramites", label: "Trámites", icon: "📋" },
    { id: "arquitectura", label: "Arquitectura", icon: "🏗️" },
  ];

  const footerItems = [
    { id: "config", label: "Configuración", icon: "⚙️" },
    { id: "help", label: "Ayuda", icon: "❓" },
  ];

  const activePage = pages.find((item) => item.id === tab) || pages[0];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 52%, ${COLORS.surface} 100%)`, color: COLORS.text, fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #070f1f; }
        button, input, select, textarea { font: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.navy}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        .btn-hover:hover { filter: brightness(1.06); }
        .nav-item:hover { background: ${COLORS.navyLight}; }
      `}</style>

      <Notification notifs={notifs} onClose={closeNotif} />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside style={{ width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, padding: "28px 20px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: COLORS.accent, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>
                S
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>SAGDI</div>
                <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 0.7 }}>Gestión Documental</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>
              Municipalidad Provincial de Yauyos
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {pages.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="nav-item btn-hover"
                style={{
                  ...navStyle(tab === item.id),
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
            {footerItems.map((item) => (
              <button key={item.id} className="nav-item btn-hover" style={{ ...navStyle(false), justifyContent: "flex-start", gap: 12, background: "transparent", color: COLORS.muted }}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <header style={{ background: COLORS.navyLight, borderBottom: `1px solid ${COLORS.border}`, padding: "22px 32px", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>
                <span>📌</span>
                Dashboard Operativo
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>SAGDI | MUNICIPALIDAD PROVINCIAL DE YAUYOS</span>
                <span style={{ color: COLORS.textMuted, fontSize: 13 }}>Sistema Automatizado de Gestión Documental Institucional</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <input
                style={{ ...inputStyle, maxWidth: 260, background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}` }}
                placeholder="Buscar trámite..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              <button style={{ ...btnStyle("ghost"), color: COLORS.textMuted, minWidth: 42, padding: "10px 12px" }}>🔔</button>
              <button style={{ ...btnStyle("ghost"), color: COLORS.textMuted, minWidth: 42, padding: "10px 12px" }}>👤</button>
            </div>
          </header>

          <div style={{ padding: "28px 32px", maxWidth: 1280, width: "100%", animation: "fadeUp 0.35s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>Página Actual</div>
                <h1 style={{ fontSize: 32, margin: "10px 0 8px", color: COLORS.text }}>{activePage.label}</h1>
                <p style={{ color: COLORS.textMuted, maxWidth: 590, lineHeight: 1.7 }}>
                  {activePage.id === "dashboard" && "Resumen de métricas, estado de la operación y actividad reciente del gateway de notificaciones."}
                  {activePage.id === "mesapartes" && "Formulario digital con pipeline de NLP, clasificación de trámites y asignación automática de prioridad."}
                  {activePage.id === "tramites" && "Gestión de expedientes con filtros avanzados, actualizaciones de estado y detalles del trámite."}
                  {activePage.id === "arquitectura" && "Arquitectura técnica del sistema, stack de tecnologías y cumplimiento legal para la implementación institucional."}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ background: COLORS.navyLight, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "10px 14px", minWidth: 180 }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.1 }}>Estado de Servicio</div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.success, display: "inline-block" }} />
                    <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 700 }}>Operativo</span>
                  </div>
                </div>
                <button style={{ ...btnStyle("primary"), minWidth: 170 }}>Ver Reporte</button>
              </div>
            </div>

            {tab === "dashboard" && (
              <Dashboard stats={stats} statsAnim={statsAnim} tramites={tramites} cardStyle={cardStyle} COLORS={COLORS} Badge={Badge} />
            )}

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

            {tab === "tramites" && (
              <Tramites
                filtered={filtered}
                searchQ={searchQ}
                setSearchQ={setSearchQ}
                filterPrio={filterPrio}
                setFilterPrio={setFilterPrio}
                filterArea={filterArea}
                setFilterArea={setFilterArea}
                areas={areas}
                selectedTramite={selectedTramite}
                setSelectedTramite={setSelectedTramite}
                updateEstado={updateEstado}
                ESTADOS={ESTADOS}
                cardStyle={cardStyle}
                inputStyle={inputStyle}
                COLORS={COLORS}
                Badge={Badge}
              />
            )}

            {tab === "arquitectura" && (
              <Arquitectura cardStyle={cardStyle} COLORS={COLORS} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
