export const TRAMITES_TIPOS = [
  "Licencia de Construcción",
  "Licencia de Funcionamiento",
  "Certificado de Residencia",
  "Partida de Nacimiento",
  "Inscripción en Padrón",
  "Permiso de Demolición",
  "Certificado de Defunción",
  "Autorización de Espectáculo",
  "Impugnación de Multa",
  "Declaratoria de Fábrica",
];

export const AREAS = {
  "Licencia de Construcción": "Gerencia de Obras",
  "Licencia de Funcionamiento": "Gerencia de Comercio",
  "Certificado de Residencia": "Registro Civil",
  "Partida de Nacimiento": "Registro Civil",
  "Inscripción en Padrón": "Registro Civil",
  "Permiso de Demolición": "Gerencia de Obras",
  "Certificado de Defunción": "Registro Civil",
  "Autorización de Espectáculo": "Gerencia de Comercio",
  "Impugnación de Multa": "Fiscalización",
  "Declaratoria de Fábrica": "Gerencia de Obras",
};

export const ESTADOS = ["Recibido", "En Revisión", "Observado", "Aprobado", "Listo para Recoger"];

export const nlpClassify = (descripcion) => {
  const lower = descripcion.toLowerCase();
  if (lower.includes("construc") || lower.includes("obra") || lower.includes("demolic") || lower.includes("fábrica"))
    return "Licencia de Construcción";
  if (lower.includes("negocio") || lower.includes("comercio") || lower.includes("local") || lower.includes("tienda"))
    return "Licencia de Funcionamiento";
  if (lower.includes("residencia") || lower.includes("domicilio") || lower.includes("vivo"))
    return "Certificado de Residencia";
  if (lower.includes("nacimiento") || lower.includes("nació") || lower.includes("bebe"))
    return "Partida de Nacimiento";
  if (lower.includes("multa") || lower.includes("sanción") || lower.includes("infrac"))
    return "Impugnación de Multa";
  if (lower.includes("espectáculo") || lower.includes("evento") || lower.includes("concierto"))
    return "Autorización de Espectáculo";
  return TRAMITES_TIPOS[Math.floor(Math.random() * TRAMITES_TIPOS.length)];
};

export const predictPriority = (tipo, descripcion) => {
  const urgentes = ["Licencia de Construcción", "Impugnación de Multa", "Permiso de Demolición", "Declaratoria de Fábrica"];
  const medios = ["Licencia de Funcionamiento", "Autorización de Espectáculo", "Inscripción en Padrón"];
  const lower = descripcion.toLowerCase();
  const hasUrgentKeywords = lower.includes("urgente") || lower.includes("plazo") || lower.includes("vence") || lower.includes("judicial");
  if (hasUrgentKeywords || urgentes.includes(tipo)) return "Alta";
  if (medios.includes(tipo)) return "Media";
  return "Baja";
};

let tramiteCounter = 1001;
export const generateId = () => `YAU-${tramiteCounter++}`;

export const initialTramites = [
  { id: "YAU-998", ciudadano: "Rosa Mendoza", dni: "42891234", tipo: "Licencia de Construcción", area: "Gerencia de Obras", prioridad: "Alta", estado: "En Revisión", fecha: "2025-05-28", descripcion: "Construcción de segundo piso en propiedad.", alertas: ["Recibido", "En Revisión"] },
  { id: "YAU-999", ciudadano: "Jorge Castillo", dni: "31245678", tipo: "Certificado de Residencia", area: "Registro Civil", prioridad: "Baja", estado: "Listo para Recoger", fecha: "2025-05-27", descripcion: "Necesito certificado de domicilio.", alertas: ["Recibido", "En Revisión", "Aprobado", "Listo para Recoger"] },
  { id: "YAU-1000", ciudadano: "Ana Torres", dni: "56789012", tipo: "Impugnación de Multa", area: "Fiscalización", prioridad: "Alta", estado: "Observado", fecha: "2025-05-29", descripcion: "Impugnar multa por infracción de tránsito.", alertas: ["Recibido", "En Revisión", "Observado"] },
];
