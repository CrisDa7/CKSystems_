// src/pages/ProjectsIndex.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Seo from "../seo/Seo";
import { SERVICES, getProjectsByService, isValidService } from "../data/projects";

const BASE = "https://www.ck-systems.example"; // cámbialo por tu dominio real

// ---------- Modal de galería (carrusel) ----------
function ModalGallery({ open, onClose, project }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const imgs = project?.images?.length ? project.images : [];
  const canShow = open && imgs.length > 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(imgs.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, imgs.length, onClose]);

  useEffect(() => {
    // al abrir, siempre desde 0
    if (open) setIdx(0);
  }, [open]);

  if (!canShow) return null;

  const atStart = idx === 0;
  const atEnd = idx === imgs.length - 1;

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove = (e) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    const d = deltaX.current;
    if (Math.abs(d) > 50) {
      if (d < 0 && !atEnd) setIdx((i) => i + 1);
      if (d > 0 && !atStart) setIdx((i) => i - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        // cerrar si click fuera del contenedor
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Contenedor */}
      <div
        className="relative z-10 w-[92vw] max-w-5xl rounded-2xl border border-white/10 bg-[#0b1424] p-3 md:p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-1 md:px-2 pb-3">
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-semibold truncate">{project.title}</h3>
            <p className="text-white/60 text-sm truncate">{project.summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div
            className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
            aria-roledescription="carousel"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {imgs.map((src, i) => (
                <div key={i} className="w-full shrink-0">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-[56vh] md:h-[62vh] object-contain bg-black/20"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Flechas */}
          <button
            type="button"
            disabled={atStart}
            onClick={() => !atStart && setIdx((i) => i - 1)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue ${
              atStart ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-white/15 hover:bg-white/20 text-white"
            }`}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            disabled={atEnd}
            onClick={() => !atEnd && setIdx((i) => i + 1)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue ${
              atEnd ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-white/15 hover:bg-white/20 text-white"
            }`}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-brand-blue" : "w-2 bg-white/30 hover:bg-white/60"}`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Página de índice ----------
export default function ProjectsIndex() {
  const { service } = useParams();
  const navigate = useNavigate();

  const current = isValidService(service) ? service : null;
  const items = useMemo(() => getProjectsByService(current), [current]);

  // abrir/cerrar modal
  const [modal, setModal] = useState({ open: false, project: null });
  const openModal = (p) => setModal({ open: true, project: p });
  const closeModal = () => setModal({ open: false, project: null });

  // filtros → usan /projects y /projects/cat/:service
  const setFilter = (key) => {
    if (!key) navigate("/projects", { replace: true });
    else navigate(`/projects/cat/${key}`, { replace: true });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Proyectos — CK Systems",
    url: `${BASE}/projects${current ? `/cat/${current}` : ""}`,
  };

  return (
    <>
      <Seo
        title="Proyectos — CK Systems"
        description="Casos y proyectos de automatización, desarrollo web, domótica y mantenimiento."
        keywords={["proyectos","automatización","desarrollo web","domótica","mantenimiento","CK Systems"]}
        canonical={`${BASE}/projects${current ? `/cat/${current}` : ""}`}
        ogImage="/og-default.png"
        siteName="CK Systems"
        jsonLd={jsonLd}
      />

      {/* Hero + filtros */}
      <section className="relative w-full bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-12">
          <p className="text-xs uppercase tracking-widest text-brand-sky">Proyectos</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold">
            Selección de trabajos realizados en distintas áreas de servicio.
          </h1>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                !current
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10"
              }`}
            >
              Todos
            </button>
            {SERVICES.map((o) => (
              <button
                key={o.key}
                onClick={() => setFilter(o.key)}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  current === o.key
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/80">No hay proyectos aún en esta categoría.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <article
                key={p.id}
                className="group ck-neon rounded-2xl border border-transparent bg-white/5 p-6 hover:-translate-y-0.5 transition"
              >
                {p.cover && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={p.cover}
                      alt=""
                      className="w-full h-40 object-cover object-center opacity-95 group-hover:opacity-100 transition"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/80 border border-white/10">
                    {SERVICES.find((s) => s.key === p.serviceKey)?.label ?? p.serviceKey}
                  </span>
                </div>

                <p className="mt-2 text-white/75">{p.summary}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openModal(p)}
                    className="px-3 py-1.5 rounded-md border border-white/15 text-white/90 hover:bg-white/10 transition text-sm"
                  >
                    Ver detalle
                  </button>
                  {/* Eliminado “Quiero algo así” */}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <ModalGallery open={modal.open} onClose={closeModal} project={modal.project} />
    </>
  );
}
