// src/components/ComHome/About.jsx
// About con look & feel CK: glass cards, neón al hover (desktop)
// y neón automático al scrollear en móvil. Incluye JSON-LD (SEO).

import { useEffect } from "react";

const BASE = "https://www.ck-systems.example"; // <-- cámbialo por tu dominio real

export default function About() {
  // Estilos locales (neón + activo sin hover)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ck-neon-sheen { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }

      .ck-neon { position: relative; }
      .ck-neon::after{
        content:""; position:absolute; inset:0; border-radius:1rem; padding:2px;
        background:linear-gradient(135deg, rgba(76,201,255,0.95) 0%, rgba(46,144,250,0.75) 50%, rgba(76,201,255,0.95) 100%);
        background-size:300% 100%;
        -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite:xor; mask-composite:exclude;
        opacity:0; transition:opacity .25s ease, filter .25s ease; pointer-events:none; filter:blur(.25px);
      }
      /* Hover (desktop) */
      .ck-neon:hover::after{ opacity:1; animation: ck-neon-sheen 1100ms ease-out forwards; filter:blur(.15px); }
      .ck-neon:hover{ box-shadow:0 0 10px rgba(76,201,255,.45),0 0 22px rgba(46,144,250,.35),0 0 44px rgba(46,144,250,.25); }

      /* Activación por scroll (agregada por JS solo en móvil) */
      .ck-neon.is-active::after{ opacity:1; animation: ck-neon-sheen 1100ms ease-out forwards; filter:blur(.15px); }
      .ck-neon.is-active{ box-shadow:0 0 10px rgba(76,201,255,.45),0 0 22px rgba(46,144,250,.35),0 0 44px rgba(46,144,250,.25); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // SEO: JSON-LD AboutPage
  useEffect(() => {
    const elId = "about-jsonld";
    const data = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Sobre CK Systems",
      "url": BASE + "/",
      "description":
        "En CK Systems impulsamos el futuro digital de empresas y personas con soluciones en desarrollo web, automatización, domótica y soporte técnico.",
      "about": {
        "@type": "Organization",
        "name": "CK Systems",
        "url": BASE + "/"
      }
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

  // Neón automático en móvil al hacer scroll (solo ≤767px)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const cards = Array.from(document.querySelectorAll("[data-about-card]"));
    if (!cards.length) return;

    // Marca una sola card como activa
    const setActive = (el) => {
      cards.forEach((c) => c.classList.toggle("is-active", c === el));
    };
    setActive(cards[0]); // al cargar, resalta la primera

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) setActive(e.target);
        });
      },
      { threshold: [0.6] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative py-20 bg-brand-navy bg-gradient-to-b from-brand-navy via-brand-navy to-[#0b1424]"
      aria-labelledby="about-title"
    >
      <div className="relative mx-auto max-w-6xl px-4">
        {/* Encabezado */}
        <p className="text-xs uppercase tracking-widest text-brand-sky">Sobre nosotros</p>
        <div className="mt-2 flex items-end gap-4">
          <h1 id="about-title" className="text-3xl md:text-4xl font-semibold">¿Quiénes somos?</h1>
          <span className="hidden md:inline-block h-[2px] w-24 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
        </div>

        {/* Intro */}
        <article
          data-about-card
          className="mt-6 ck-neon rounded-2xl border border-transparent bg-white/5 backdrop-blur p-6 md:p-8"
          aria-label="Introducción CK Systems"
        >
          <p className="text-white/85">
            En <span className="font-semibold text-white">CK Systems</span> impulsamos el futuro digital de empresas y personas.
            Creamos soluciones <span className="text-brand-sky/90">smart</span> en <span className="text-white">desarrollo web</span>,
            <span className="text-white"> automatización de procesos</span>, <span className="text-white">domótica</span> y
            <span className="text-white"> soporte técnico</span>, combinando innovación, diseño y tecnología de punta.
          </p>
          <p className="mt-3 text-white/70">
            Nuestro enfoque es simple: hacer tu vida y tu negocio más eficientes, conectados y seguros.
          </p>
        </article>

        {/* Misión / Visión (iconos limpios, sin contenedor) */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Misión */}
          <article
            data-about-card
            className="ck-neon rounded-2xl border border-transparent bg-white/5 backdrop-blur p-6 md:p-8 transition hover:-translate-y-0.5"
            aria-labelledby="about-mission-title"
          >
            <div className="flex items-start gap-3">
              {/* Icono línea, sin fondo */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-brand-blue mt-1 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3.25" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
              </svg>

              <div>
                <h2 id="about-mission-title" className="text-xl font-semibold">Misión</h2>
                <p className="mt-2 text-white/80">
                  Entregar soluciones tecnológicas inteligentes y confiables que transformen ideas en resultados,
                  optimicen procesos y generen experiencias digitales memorables para nuestros clientes.
                </p>
              </div>
            </div>
          </article>

          {/* Visión */}
          <article
            data-about-card
            className="ck-neon rounded-2xl border border-transparent bg-white/5 backdrop-blur p-6 md:p-8 transition hover:-translate-y-0.5"
            aria-labelledby="about-vision-title"
          >
            <div className="flex items-start gap-3">
              {/* Icono línea, sin fondo */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-brand-blue mt-1 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3.25" />
              </svg>

              <div>
                <h2 id="about-vision-title" className="text-xl font-semibold">Visión</h2>
                <p className="mt-2 text-white/80">
                  Ser el referente en innovación digital de la región, creando un ecosistema de soluciones tecnológicas
                  que inspiren crecimiento, modernicen negocios y faciliten la vida de las personas.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
