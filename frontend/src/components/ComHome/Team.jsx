// src/components/ComHome/Team.jsx
// Carrusel de equipo con scroll-snap (móvil: arrastrable con el dedo),
// autoplay hacia la derecha sin loop, flechas con estados, dots, swipe/drag
// natural y SEO JSON-LD. Subrayado azul + halos sutiles en el slide activo.

import { useEffect, useRef, useState } from "react";
import cristianImg from "../../assets/imgHome/cristian.png";
import kevinImg from "../../assets/imgHome/kevin.png";

const BASE = "https://www.ck-systems.example"; // <-- cambia por tu dominio real

const TEAM = [
  {
    key: "cristian",
    name: "Cristian Ajila",
    role: "Ingeniero en Sistemas y Computación",
    photo: cristianImg,
    bio:
      "Apasionado por la innovación tecnológica y el desarrollo de soluciones digitales. Con experiencia en programación, diseño de software y automatización de procesos, lidera la creación de plataformas eficientes y seguras para impulsar la transformación digital de nuestros clientes.",
  },
  {
    key: "kevin",
    name: "Kevin Ajila",
    role: "Ingeniero Mecatrónico",
    photo: kevinImg,
    bio:
      "Especialista en integración de sistemas mecánicos, electrónicos y de control. Su enfoque está en diseñar soluciones inteligentes que combinen hardware y software para optimizar procesos, mejorar la eficiencia y ofrecer experiencias tecnológicas de alto impacto.",
  },
];

export default function Team() {
  const railRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const atStart = index === 0;
  const atEnd = index === TEAM.length - 1;

  // ====== Helpers ======
  const scrollToIndex = (i, behavior = "smooth") => {
    const rail = railRef.current;
    if (!rail) return;
    const clamped = Math.max(0, Math.min(TEAM.length - 1, i));
    const left = clamped * rail.clientWidth; // cada slide ocupa 100% del rail
    rail.scrollTo({ left, behavior });
  };

  const next = () => !atEnd && scrollToIndex(index + 1);
  const prev = () => !atStart && scrollToIndex(index - 1);
  const goTo = (i) => scrollToIndex(i);

  // ====== Sincronizar index con el scroll (rAF-throttle) ======
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(rail.scrollLeft / rail.clientWidth);
        setIndex((prev) => (prev === i ? prev : i));
      });
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("orientationchange", onScroll);

    // Ajuste inicial
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
    };
  }, []);

  // ====== Autoplay (cada 3s) hacia la derecha, sin loop ======
  useEffect(() => {
    if (paused || atEnd) return;
    const id = setInterval(() => {
      next();
    }, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, atEnd, index]);

  // Pausa cuando el usuario interactúa (hover/focus/drag)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const pause = () => setPaused(true);
    const resume = () => setPaused(false);

    rail.addEventListener("pointerdown", pause);
    rail.addEventListener("pointerup", resume);
    rail.addEventListener("pointercancel", resume);
    rail.addEventListener("mouseenter", pause);
    rail.addEventListener("mouseleave", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);

    return () => {
      rail.removeEventListener("pointerdown", pause);
      rail.removeEventListener("pointerup", resume);
      rail.removeEventListener("pointercancel", resume);
      rail.removeEventListener("mouseenter", pause);
      rail.removeEventListener("mouseleave", resume);
      rail.removeEventListener("focusin", pause);
      rail.removeEventListener("focusout", resume);
    };
  }, []);

  // ====== SEO: JSON-LD empleados ======
  useEffect(() => {
    const elId = "team-jsonld";
    const abs = (src) =>
      src?.startsWith("http") ? src : new URL(src, window.location.origin).href;

    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CK Systems",
      "url": BASE + "/",
      "employee": TEAM.map((m) => ({
        "@type": "Person",
        "name": m.name,
        "jobTitle": m.role,
        "description": m.bio,
        "image": abs(m.photo),
        "worksFor": { "@type": "Organization", "name": "CK Systems", "url": BASE + "/" }
      })),
    };
    let el = document.getElementById(elId);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = elId;
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(data);
  }, []);

  return (
    <section
      id="team"
      className="relative py-20 bg-[#0b1424]"
      aria-labelledby="team-title"
    >
      {/* Título */}
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs uppercase tracking-widest text-brand-sky">Nuestro equipo</p>

        {/* Línea azul a la derecha del título */}
        <div className="mt-2 flex items-end gap-4">
          <h2 id="team-title" className="text-3xl md:text-4xl font-semibold">
            Conoce a nuestros profesionales
          </h2>
          <span className="hidden md:inline-block h-[2px] w-24 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
        </div>

        {/* Bajada */}
        <p className="mt-3 text-white/70 max-w-2xl">
          Un equipo multidisciplinario listo para impulsar tus proyectos con ingeniería, software y
          automatización.
        </p>
      </div>

      {/* Carrusel con scroll-snap (arrastrable en móvil) */}
      <div className="relative w-full mt-8" aria-roledescription="carousel" aria-label="Nuestro equipo">
        {/* Rail */}
        <div
          ref={railRef}
          className="
            relative w-full overflow-x-auto overflow-y-visible
            flex snap-x snap-mandatory
            scroll-smooth scroll-px-4
            -mx-4 px-4
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
          style={{ scrollbarWidth: "none" }}
        >
          {/* Ocultar scrollbar en WebKit */}
          <style>{`.snap-x::-webkit-scrollbar{display:none}`}</style>

          {TEAM.map((m, i) => (
            <article
              key={m.key}
              className="w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${m.name} — ${i + 1} de ${TEAM.length}`}
            >
              <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-[320px_1fr] items-center min-h-[420px]">
                {/* Foto circular con glow cuando está activa */}
                <div className="flex justify-center md:justify-start">
                  <div className="relative">
                    {/* Halo sutil (solo en activo) */}
                    <span
                      className={`pointer-events-none absolute -inset-4 rounded-full blur-2xl transition-opacity duration-300 ${
                        i === index ? "opacity-70 bg-brand-blue/25" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    <img
                      src={m.photo}
                      alt={`Foto de ${m.name}`}
                      width={224}
                      height={224}
                      className={`relative h-40 w-40 md:h-56 md:w-56 rounded-full object-cover ring-1 transition-all duration-500 ${
                        i === index ? "ring-brand-blue/40 scale-[1.02]" : "ring-white/10 scale-100"
                      }`}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Texto con glow lateral sutil (solo en el slide activo) */}
                <div className="relative">
                  {/* Capa de halos izquierda/derecha */}
                  <span
                    className={`pointer-events-none absolute -inset-6 md:-inset-8 rounded-3xl z-0 transition-opacity duration-300 ${
                      i === index ? "opacity-70" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="absolute -left-12 top-1/2 -translate-y-1/2 h-24 w-24 md:h-40 md:w-40 rounded-full blur-3xl bg-brand-blue/20" />
                    <span className="absolute -right-12 top-1/2 -translate-y-1/2 h-24 w-24 md:h-40 md:w-40 rounded-full blur-3xl bg-brand-sky/20" />
                  </span>

                  {/* Contenido */}
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-semibold">{m.name}</h3>
                    <p className="mt-1 text-brand-sky">{m.role}</p>
                    <p className="mt-4 text-white/80 leading-relaxed">{m.bio}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Flechas (deshabilitadas en extremos) */}
        <button
          type="button"
          onClick={prev}
          disabled={atStart}
          className={`absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full
            focus:outline-none focus:ring-2 focus:ring-brand-blue
            ${atStart ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-white/10 hover:bg-white/15 text-white"}`}
          aria-label="Anterior"
          aria-disabled={atStart}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          className={`absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full
            focus:outline-none focus:ring-2 focus:ring-brand-blue
            ${atEnd ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-white/10 hover:bg-white/15 text-white"}`}
          aria-label="Siguiente"
          aria-disabled={atEnd}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {TEAM.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-blue" : "w-2 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
