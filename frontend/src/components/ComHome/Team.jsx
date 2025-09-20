// src/components/ComHome/Team.jsx
// Carrusel de equipo (2 miembros) sin loop: autoplay hacia la derecha hasta el final,
// flechas con estados (deshabilitadas en extremos), dots, swipe y SEO JSON-LD.
// Subrayado azul en el título + halo sutil en foto y texto del miembro activo.

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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);

  const atStart = index === 0;
  const atEnd = index === TEAM.length - 1;

  // Autoplay (3s) hacia la derecha, sin loop (se detiene en el último)
  useEffect(() => {
    if (paused || atEnd) return;
    const id = setInterval(() => {
      setIndex((i) => Math.min(TEAM.length - 1, i + 1));
    }, 3000);
    return () => clearInterval(id);
  }, [paused, atEnd]);

  // SEO: JSON-LD empleados
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

  // Navegación manual (sin superar extremos)
  const goTo = (i) => setIndex(() => Math.max(0, Math.min(TEAM.length - 1, i)));
  const next = () => !atEnd && setIndex((i) => i + 1);
  const prev = () => !atStart && setIndex((i) => i - 1);

  // Swipe móvil (respeta extremos)
  const onTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    deltaXRef.current = 0;
    setPaused(true);
  };
  const onTouchMove = (e) => {
    deltaXRef.current = e.touches[0].clientX - startXRef.current;
  };
  const onTouchEnd = () => {
    const d = deltaXRef.current;
    if (Math.abs(d) > 50) {
      if (d < 0 && !atEnd) next();
      if (d > 0 && !atStart) prev();
    }
    setPaused(false);
  };

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

      {/* Carrusel */}
      <div
        className="relative w-full overflow-hidden mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Nuestro equipo"
      >
        {/* Pista */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          role="group"
          aria-live="polite"
        >
          {TEAM.map((m, i) => (
            <article
              key={m.key}
              className="w-full shrink-0"
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
