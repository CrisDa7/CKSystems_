// src/data/projects.js

// ====== IMPORTS: Desarrollo Web / proyecto-1 ======
import web1Cover from "../assets/projects/webdev/proyecto-1/cover.png";
import web1Img1 from "../assets/projects/webdev/proyecto-1/1.png";
import web1Img2 from "../assets/projects/webdev/proyecto-1/2.png";
import web1Img3 from "../assets/projects/webdev/proyecto-1/3.png";
import web1Img4 from "../assets/projects/webdev/proyecto-1/4.png";
// Si tu archivo es 5.png, descomenta la de abajo y borra la otra.
// Si realmente es 5.pnf, corrige el nombre del archivo a 5.png en disco.
import web1Img5 from "../assets/projects/webdev/proyecto-1/5.png";
// import web1Img5 from "../assets/projects/webdev/proyecto-1/5.pnf"; // ❌ evita .pnf

// ====== (Opcional) placeholders para otras categorías ======
// Si no tienes imágenes de "coming soon", puedes omitir estos imports y usar solo texto.
// import comingAutomation from "../assets/projects/automation/coming-soon.jpg";
// import comingDomotics from "../assets/projects/domotics/coming-soon.jpg";
// import comingIT from "../assets/projects/it/coming-soon.jpg";

// Filtros/categorías (coinciden con Services.jsx y rutas)
export const SERVICES = [
  { key: "automation", label: "Automatización" },
  { key: "webdev",     label: "Desarrollo web" },
  { key: "domotics",   label: "Domótica" },
  { key: "it",         label: "Mantenimiento" },
];

// Proyectos
export const PROJECTS = [
  // ====== WEBDEV: tu proyecto real ======
  {
    id: "web-proyecto-1",
    serviceKey: "webdev",
    title: "Proyecto de Desarrollo Web — Proyecto 1",
    summary:
      "Sitio moderno con React + Vite. Buen SEO técnico y desempeño (Core Web Vitals).",
    cover: web1Cover,
    images: [web1Img1, web1Img2, web1Img3, web1Img4, web1Img5], // carrusel del modal
  },

  // ====== Placeholders (opcional) ======
  {
    id: "auto-coming",
    serviceKey: "automation",
    title: "Automatización — Próximamente",
    summary: "Muy pronto publicaremos casos reales de automatización.",
    // cover: comingAutomation,
    images: [], // sin carrusel
  },
  {
    id: "domo-coming",
    serviceKey: "domotics",
    title: "Domótica — Próximamente",
    summary: "Proyectos de domótica en proceso.",
    // cover: comingDomotics,
    images: [],
  },
  {
    id: "it-coming",
    serviceKey: "it",
    title: "Mantenimiento — Próximamente",
    summary: "Casos de soporte y estandarización en camino.",
    // cover: comingIT,
    images: [],
  },
];

// Helpers usados por ProjectsIndex.jsx
export const isValidService = (key) =>
  SERVICES.some((s) => s.key === key);

export const getProjectsByService = (key) => {
  if (!key || !isValidService(key)) return PROJECTS;
  return PROJECTS.filter((p) => p.serviceKey === key);
};
