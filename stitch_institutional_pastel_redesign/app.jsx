import { useEffect, useRef, useState } from "react";
import Dashboard from "./pages/Dashboard";
import MesaDePartes from "./pages/MesaDePartes";
import Tramites from "./pages/Tramites";
import Arquitectura from "./pages/Arquitectura";
import Notification from "./components/Notification";
import Badge from "./components/Badge";
import { nlpClassify, predictPriority, generateId, initialTramites, AREAS, ESTADOS } from "./utils/mlUtils";
import { COLORS } from "./styles/theme";
import "./App.css";

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
    background: active ? COLORS.accent : "transparent",
    border: "none",
    color: active ? "#fff" : COLORS.muted,
    borderRadius: 8,
    padding: "9px 18px",
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    transition: "all 0.2s",
    letterSpacing: 0.3,
    display: "flex",
    alignItems: "center",
    gap: 7,
  });

  const cardStyle = {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: "22px 24px",
  };

  const inputStyle = {
    width: "100%",
    background: COLORS.navyLight,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const btnStyle = (variant = "primary") => ({
    background: variant === "primary" ? COLORS.accent : variant === "success" ? COLORS.success : COLORS.surface,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.navy,
        color: COLORS.text,
        fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      }}
    >
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

      <div
        style={{
          background: COLORS.navyLight,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${COLORS.accent}, #0050CC)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              S
            </div>
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
              <button
                key={t.id}
                style={navStyle(tab === t.id)}
                onClick={() => setTab(t.id)}
                className="btn-hover"
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#00C48C22",
              border: "1px solid #00C48C44",
              borderRadius: 8,
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: COLORS.success,
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: 12, color: COLORS.success, fontWeight: 600 }}>Sistema Activo</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
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
    </div>
  );
}

export default App;
