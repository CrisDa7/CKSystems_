// src/components/ComHome/Services.jsx
// Cards con efecto neón (solo hover) + carrusel móvil (scroll-snap).
// Fondo con imagen + velo oscuro.

import bgImg from "../../assets/imgHome/heroFondo.png";

const items = [
  { key: "automation", title: "Automatización", desc: "Integramos procesos con APIs, bots y dashboards para acelerar tu operación.", icon: "automation" },
  { key: "webdev",     title: "Desarrollo web", desc: "Sitios y apps con rendimiento, SEO y una experiencia impecable.",               icon: "web" },
  { key: "domotics",   title: "Domótica",       desc: "Control inteligente para hogares y oficinas: confort, seguridad y ahorro.",    icon: "home" },
  { key: "it",         title: "Mantenimiento en hardware y software", desc: "Optimización, limpieza, backups y soporte para mantener todo al día.", icon: "wrench" },
];

// Íconos SVG
function Icon({ name, className = "w-10 h-10" }) {
  switch (name) {
    case "automation":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Z" />
          <path d="M12 2v3M12 19v3M4.9 5.1l2.1 2.1M17 16l2.1 2.1M2 12h3M19 12h3M4.9 18.9 7 16.8M17 7.2 19.1 5.1" strokeLinecap="round"/>
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 8h18" />
          <circle cx="7" cy="6" r="1" />
          <circle cx="10" cy="6" r="1" />
          <path d="M7 12h10M7 15h6" strokeLinecap="round"/>
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round"/>
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9.5 14.5h5v5h-5z" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14.5 5.5A4.5 4.5 0 0 0 8 10l6 6a4.5 4.5 0 0 0 4.5-6.5L16 12l-1.5-1.5 0-5Z" />
          <path d="M7 17 4 20" strokeLinecap="round" />
          <circle cx="4" cy="20" r="1.35" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-20 overflow-hidden"
      aria-labelledby="services-title"
    >
      {/* Fondo con imagen + velo oscuro + degradado de marca */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="h-full w-full bg-center bg-cover scale-105"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-brand-navy/65 to-[#0b1424]/80" />
      </div>

      {/* Keyframes + utilidades (sin activación por scroll) */}
      <style>{`
        @keyframes ck-pulse { 0%{transform:scale(1)} 50%{transform:scale(1.06)} 100%{transform:scale(1)} }
        @keyframes ck-neon-sheen { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }

        .ck-neon { position: relative; }
        .ck-neon::after{
          content:"";
          position:absolute; inset:0; border-radius:1rem;
          padding:2px;
          background:linear-gradient(135deg, rgba(76,201,255,0.95) 0%, rgba(46,144,250,0.75) 50%, rgba(76,201,255,0.95) 100%);
          background-size:300% 100%;
          -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude;
          opacity:0; transition:opacity .25s ease, filter .25s ease;
          pointer-events:none; filter:blur(.25px);
        }
        .ck-neon:hover::after{ opacity:1; animation: ck-neon-sheen 1100ms ease-out forwards; filter:blur(.15px); }
        .ck-neon:hover{ box-shadow:0 0 10px rgba(76,201,255,.45),0 0 22px rgba(46,144,250,.35),0 0 44px rgba(46,144,250,.25); }

        .ck-rail{
          scroll-snap-type:x mandatory;
          scroll-behavior:smooth;
          overscroll-behavior-x:contain;
          -webkit-overflow-scrolling:touch;
          -ms-overflow-style:none; scrollbar-width:none;
          mask-image: linear-gradient(to right, transparent 0, rgba(0,0,0,.9) 24px, rgba(0,0,0,1) calc(100% - 24px), transparent 100%);
        }
        .ck-rail::-webkit-scrollbar{ display:none; }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Encabezado */}
        <p className="text-xs uppercase tracking-widest text-brand-sky">Nuestros servicios</p>
        <div className="mt-2 flex items-end gap-4">
          <h2 id="services-title" className="text-3xl md:text-4xl font-semibold">Lo que ofrecemos</h2>
          <span className="hidden md:inline-block h-[2px] w-24 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
        </div>
        <p className="mt-3 text-white/80 max-w-2xl">
          Soluciones tecnológicas eficientes y escalables, creadas para generar impacto real en tu operación.
        </p>

        {/* MÓVIL: carrusel (sin neón automático por scroll) */}
        <div className="mt-8 md:hidden relative">
          <div
            className="ck-rail -mx-4 px-4 flex gap-4 overflow-x-auto scroll-px-4"
            role="region"
            aria-label="Carrusel de servicios"
          >
            {items.map((s, i) => (
              <article
                key={s.key}
                data-card
                data-key={s.key}
                className={[
                  "group ck-neon overflow-hidden rounded-2xl",
                  "border border-white/10 bg-white/5 backdrop-blur",
                  "p-6 transition will-change-transform",
                  "hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(21,112,239,0.35)]",
                  "snap-center shrink-0 w-[85%]",
                  // 🚫 sin clase 'is-active' aquí
                ].join(" ")}
                style={{ animationDelay: `${i * 120}ms` }}
                aria-labelledby={`service-title-${s.key}`}
              >
                <div
                  className="
                    relative mb-5 inline-grid place-items-center
                    h-16 w-16 rounded-full
                    bg-gradient-to-br from-brand-blue/35 to-brand-blue/15
                    text-brand-blue ring-1 ring-brand-blue/40
                    animate-[ck-pulse_2.4s_ease-in-out_infinite]
                    group-hover:animate-[ck-pulse_1.2s_ease-in-out_infinite]
                  "
                  aria-hidden="true"
                >
                  <Icon name={s.icon} />
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_24px_0_rgba(46,144,250,0.35)] opacity-0 group-hover:opacity-100 transition" />
                </div>

                <h3 id={`service-title-${s.key}`} className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/80">{s.desc}</p>

                <div className="mt-4">
                  <a
                    href={`/services#${s.key}`}
                    className="text-sm text-brand-sky hover:text-white underline-offset-4 hover:underline"
                  >
                    Más info →
                  </a>
                </div>

                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-blue transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>
        </div>

        {/* TABLET/DESKTOP: grilla (hover-only) */}
        <div className="mt-10 hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <article
              key={s.key}
              className="
                group ck-neon overflow-hidden rounded-2xl
                border border-white/10 bg-white/5 backdrop-blur
                p-6 transition will-change-transform
                hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(21,112,239,0.35)]
              "
              style={{ animationDelay: `${i * 120}ms` }}
              aria-labelledby={`service-title-${s.key}`}
            >
              <div
                className="
                  relative mb-5 inline-grid place-items-center
                  h-16 w-16 rounded-full
                  bg-gradient-to-br from-brand-blue/35 to-brand-blue/15
                  text-brand-blue ring-1 ring-brand-blue/40
                  animate-[ck-pulse_2.4s_ease-in-out_infinite]
                  group-hover:animate-[ck-pulse_1.2s_ease-in-out_infinite]
                "
                aria-hidden="true"
              >
                <Icon name={s.icon} />
                <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_24px_0_rgba(46,144,250,0.35)] opacity-0 group-hover:opacity-100 transition" />
              </div>

              <h3 id={`service-title-${s.key}`} className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/80">{s.desc}</p>

              <div className="mt-4">
                <a
                  href={`/services#${s.key}`}
                  className="text-sm text-brand-sky hover:text-white underline-offset-4 hover:underline"
                >
                  Más info →
                </a>
              </div>

              <span
                className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-blue transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
