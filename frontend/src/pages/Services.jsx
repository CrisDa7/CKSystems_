// src/pages/Services.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Seo from "../seo/Seo";

const BASE = "https://www.ck-systems.example"; // <-- reemplaza por tu dominio real

// --- Data de servicios (clave = anchor) ---
const SERVICES = [
  {
    key: "automation",
    title: "Automatización",
    desc:
      "Integramos procesos con APIs, bots y dashboards para acelerar tu operación y reducir errores.",
    bullets: [
      "Integración con APIs (ERP/CRM/Google Workspace)",
      "Bots/Jobs programados (extracción, limpieza y carga de datos)",
      "Workflows y aprobaciones automáticas",
      "Dashboards operativos y de dirección",
    ],
  },
  {
    key: "webdev",
    title: "Desarrollo web",
    desc:
      "Sitios y apps con rendimiento, SEO y una experiencia impecable para convertir visitas en clientes.",
    bullets: [
      "Landing pages y sitios corporativos",
      "Aplicaciones con React/Vite/Next.js",
      "Optimización de rendimiento y Core Web Vitals",
      "Formularios, email y analítica (Plausible/GA4)",
    ],
  },
  {
    key: "domotics",
    title: "Domótica",
    desc:
      "Control inteligente para hogares y oficinas: confort, seguridad y eficiencia energética.",
    bullets: [
      "Automatización de iluminación y climatización",
      "Cámaras, sensores y alertas",
      "Integración con asistentes de voz",
      "Escenas personalizadas y control remoto",
    ],
  },
  {
    key: "it",
    title: "Mantenimiento de computadoras",
    desc:
      "Mantenemos tus equipos en óptimas condiciones para que nada frene tu trabajo.",
    bullets: [
      "Optimización y limpieza de sistema",
      "Backups y recuperación",
      "Instalación/actualización de software",
      "Soporte remoto y presencial",
    ],
  },
];

// --- Iconos SVG (un solo set) ---
function Icon({ name, className = "w-10 h-10" }) {
  switch (name) {
    case "automation":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Z" />
          <path d="M12 2v3M12 19v3M4.9 5.1l2.1 2.1M17 16l2.1 2.1M2 12h3M19 12h3M4.9 18.9 7 16.8M17 7.2 19.1 5.1" strokeLinecap="round"/>
        </svg>
      );
    case "webdev":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 8h18" />
          <circle cx="7" cy="6" r="1" />
          <circle cx="10" cy="6" r="1" />
          <path d="M7 12h10M7 15h6" strokeLinecap="round"/>
        </svg>
      );
    case "domotics":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round"/>
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9.5 14.5h5v5h-5z" />
        </svg>
      );
    case "it":
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

export default function ServicesPage() {
  const { hash } = useLocation();
  const [flashKey, setFlashKey] = useState(null);     // flash al navegar por hash
  const [activeKey, setActiveKey] = useState(null);   // tarjeta activa (solo móvil)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  // CSS: flash + pulso + NEÓN + estado activo sin hover
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Flash cuando llegas con #hash */
      @keyframes ck-flash-outline {
        0%   { box-shadow: 0 0 0 0 rgba(46, 144, 250, 0.0); }
        10%  { box-shadow: 0 0 0 3px rgba(46, 144, 250, 0.45); }
        60%  { box-shadow: 0 0 0 3px rgba(46, 144, 250, 0.45); }
        100% { box-shadow: 0 0 0 0 rgba(46, 144, 250, 0.0); }
      }
      .ck-flash { animation: ck-flash-outline 900ms ease-in-out 1; border-color: rgba(46, 144, 250, 0.55) !important; }

      /* Pulso del icono */
      @keyframes ck-pulse { 0%{transform:scale(1)} 50%{transform:scale(1.06)} 100%{transform:scale(1)} }
      .ck-icon-pulse { animation: ck-pulse 2.4s ease-in-out infinite; transform-origin:center; }
      .ck-icon-pulse:hover { animation-duration: 1.2s; }

      /* Neón (hover) */
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
      .ck-neon:hover::after{ opacity:1; animation: ck-neon-sheen 1100ms ease-out forwards; filter:blur(.15px); }
      .ck-neon:hover{ box-shadow:0 0 10px rgba(76,201,255,.45),0 0 22px rgba(46,144,250,.35),0 0 44px rgba(46,144,250,.25); }

      /* Activación por scroll (se aplicará solo si el componente agrega la clase) */
      .ck-neon.is-active::after{ opacity:1; animation: ck-neon-sheen 1100ms ease-out forwards; filter:blur(.15px); }
      .ck-neon.is-active{ box-shadow:0 0 10px rgba(76,201,255,.45),0 0 22px rgba(46,144,250,.35),0 0 44px rgba(46,144,250,.25); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Detectar cambios de tamaño para decidir móvil/escritorio
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    setIsMobile(mq.matches);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  // Scroll si llega con #hash desde otra ruta (con offset del header)
  useEffect(() => {
    if (hash) smoothTo(hash.slice(1), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const getHeaderOffset = () => {
    const header = document.querySelector("header");
    const h = header ? header.getBoundingClientRect().height : 72;
    return h + 16;
  };

  const smoothTo = (id, fromHash = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: "smooth" });
    const delay = fromHash ? 200 : 250;
    setTimeout(() => setFlashKey(id), delay);
  };

  // --- IntersectionObserver SOLO en móvil ---
  useEffect(() => {
    if (!isMobile) return; // nada en escritorio

    const sections = Array.from(document.querySelectorAll("[data-service-card]"));
    if (!sections.length) return;

    // enfoca la primera
    if (!activeKey) setActiveKey(sections[0].id);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.id;
          if (!id) return;
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            setActiveKey(id);
          }
        });
      },
      { root: null, threshold: [0.6] }
    );

    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // JSON-LD OfferCatalog (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Servicios de CK Systems",
    "itemListElement": SERVICES.map((s) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": s.title,
        "description": s.desc,
        "provider": { "@type": "Organization", "name": "CK Systems" },
        "areaServed": "Ecuador"
      },
      "url": `${BASE}/services#${s.key}`
    })),
  };

  // WhatsApp CTA final (botón azul)
  const waMsg = encodeURIComponent("Hola, me gustaría hablar sobre sus servicios de CK Systems.");
  const waHref = `https://wa.me/593994494004?text=${waMsg}`;

  return (
    <>
      <Seo
        title="Servicios — CK Systems"
        description="Automatización, desarrollo web, domótica y mantenimiento de computadoras. Soluciones tecnológicas de alta calidad."
        keywords={["automatización","desarrollo web","domótica","mantenimiento de computadoras","CK Systems"]}
        canonical={`${BASE}/services`}
        ogImage="/og-default.png"
        siteName="CK Systems"
        jsonLd={jsonLd}
      />

      {/* Hero con tabs */}
      <section className="relative w-full bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-12">
          <p className="text-xs uppercase tracking-widest text-brand-sky">Servicios</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold">Qué podemos hacer por ti</h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Diseñamos e implementamos soluciones a medida para acelerar tu negocio con calidad y seguridad.
          </p>

          {/* Tabs (chips) */}
          <div className="mt-6 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                onClick={() => smoothTo(s.key)}
                className="px-3 py-1.5 rounded-md bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border border-white/10 text-sm"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-10">
          {SERVICES.map((s) => {
            // Activo SOLO si es móvil y la tarjeta coincide
            const isActive = isMobile && activeKey === s.key;
            return (
              <section
                id={s.key}
                key={s.key}
                data-service-card
                className={`
                  relative ck-neon rounded-2xl border border-transparent bg-white/5 p-6
                  transition hover:-translate-y-0.5
                  ${flashKey === s.key ? "ck-flash" : ""}
                  ${isActive ? "is-active" : ""}
                `}
                onAnimationEnd={() => setFlashKey(null)}
                aria-labelledby={`${s.key}-title`}
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-blue/35 to-brand-blue/15 text-brand-blue ring-1 ring-brand-blue/40 grid place-items-center ck-icon-pulse"
                    aria-hidden="true"
                  >
                    <Icon name={s.key} className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 id={`${s.key}-title`} className="text-xl font-semibold">{s.title}</h2>
                    <p className="mt-1 text-white/70">{s.desc}</p>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-blue" aria-hidden="true" />
                      <span className="text-sm text-white/85">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/contact?service=${s.key}`}
                    className="px-4 py-2 rounded-md bg-brand-blue text-white hover:bg-brand-blueDark transition no-underline"
                  >
                    Quiero este servicio
                  </Link>
                  <Link
                    to={`/projects?service=${s.key}`}
                    className="px-4 py-2 rounded-md border border-white/15 text-white/90 hover:bg-white/10 transition no-underline"
                  >
                    Ver proyectos
                  </Link>
                </div>
              </section>
            );
          })}

          {/* CTA final → WhatsApp (azul) */}
          <section className="relative ck-neon rounded-2xl border border-transparent bg-gradient-to-r from-brand-blue/15 to-transparent p-8 transition">
            <h2 className="text-2xl font-semibold">¿Listo para impulsar tu proyecto?</h2>
            <p className="mt-2 text-white/80 max-w-2xl">
              Cuéntanos tu idea y te proponemos la mejor solución en desarrollo, automatización o domótica.
            </p>
            <div className="mt-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-3 rounded-md bg-brand-blue text-white hover:bg-brand-blueDark transition no-underline"
              >
                Contactar ahora
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
