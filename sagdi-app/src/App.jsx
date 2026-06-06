import { useEffect, useRef, useState } from "react";
import Dashboard from "./pages/Dashboard";
import MesaDePartes from "./pages/MesaDePartes";
import Tramites from "./pages/Tramites";
import Arquitectura from "./pages/Arquitectura";
import Reportes from "./pages/Reportes";
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

  const downloadReport = () => {
    const rows = [
      ["Métrica", "Valor"],
      ["Total de trámites", stats.total],
      ["Prioridad alta", stats.alta],
      ["Trámites pendientes", stats.pendientes],
      ["Listos para recoger", stats.listos],
      ["Áreas distintas", areas.length - 1],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sagdi-reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navStyle = (active) => ({
    background: active ? COLORS.surfaceLight : "transparent",
    border: "none",
    color: active ? COLORS.accent : COLORS.text,
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
    boxShadow: `0 14px 45px ${COLORS.shadow}`,
  };

  const inputStyle = {
    width: "100%",
    background: COLORS.surface,
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
    color: variant === "ghost" ? COLORS.text : "#fff",
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    borderRadius: 12,
    padding: "13px 20px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s ease",
  });

  const pages = [
    { id: "dashboard", label: "Dashboard" },
    { id: "mesapartes", label: "Mesa de Partes" },
    { id: "tramites", label: "Trámites" },
    { id: "reportes", label: "Reportes" },
    { id: "arquitectura", label: "Arquitectura" },
  ];

  const footerItems = [
    { id: "config", label: "Configuración" },
    { id: "help", label: "Ayuda" },
  ];

  const activePage = pages.find((item) => item.id === tab) || pages[0];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.surfaceLight} 60%, ${COLORS.surface} 100%)`, color: COLORS.text, fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: ${COLORS.background}; color: ${COLORS.text}; }
        button, input, select, textarea { font: inherit; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.surfaceLight}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        .btn-hover:hover { filter: brightness(1.04); }
        .nav-item:hover { background: ${COLORS.surfaceLight}; }
        .row-hover:hover { background: ${COLORS.surfaceLight}; }
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
                <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.7 }}>Gestión Documental</div>
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
                style={navStyle(tab === item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
            {footerItems.map((item) => (
              <button key={item.id} className="nav-item btn-hover" style={{ ...navStyle(false), justifyContent: "flex-start", gap: 12, background: "transparent", color: COLORS.textMuted }}>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <header style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "22px 32px", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ minWidth: 320 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>Dashboard operativo</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>SAGDI | Municipalidad Provincial de Yauyos</span>
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 8, maxWidth: 640 }}>
                Sistema de gestión documental inteligente para trámites, seguimiento y reportes operativos.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <input
                style={{ ...inputStyle, maxWidth: 320, background: COLORS.surfaceLight }}
                placeholder="Buscar trámite..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              <button style={{ ...btnStyle("ghost"), minWidth: 140 }}>Notificaciones</button>
              <button style={{ ...btnStyle("ghost"), minWidth: 120 }}>Perfil</button>
            </div>
          </header>

          <div style={{ padding: "28px 32px", width: "100%", animation: "fadeUp 0.35s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ flex: "1 1 420px", minWidth: 280 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent, marginBottom: 8 }}>Página actual</div>
                <h1 style={{ fontSize: 34, margin: "10px 0 12px", color: COLORS.text }}>{activePage.label}</h1>
                <p style={{ color: COLORS.textMuted, maxWidth: 680, lineHeight: 1.7, margin: 0 }}>
                  {activePage.id === "dashboard" && "Resumen de métricas, estado de operación y actividad reciente de la mesa de partes."}
                  {activePage.id === "mesapartes" && "Formulario digital de ingreso con clasificación automática y priorización inteligente."}
                  {activePage.id === "tramites" && "Gestión de trámites con filtros, actualización de estado y vista de detalles."}
                  {activePage.id === "reportes" && "Panel de reportes operativos con exportación de datos y métricas clave."}
                  {activePage.id === "arquitectura" && "Visión técnica del stack, la arquitectura y el cumplimiento institucional."}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "14px 18px", minWidth: 180 }}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1.1 }}>Estado de servicio</div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.success, display: "inline-block" }} />
                    <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 700 }}>Operativo</span>
                  </div>
                </div>
                <button style={{ ...btnStyle("primary"), minWidth: 170 }} onClick={() => setTab("reportes")}>Abrir reporte</button>
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

            {tab === "reportes" && (
              <Reportes stats={stats} tramites={tramites} cardStyle={cardStyle} COLORS={COLORS} downloadReport={downloadReport} />
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
