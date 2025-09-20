// src/components/layout/Navbar.jsx
// Navbar en español con “Inicio”, logo grande y menú móvil
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // ajusta si mueves el archivo

const BASE_URL = "https://www.ck-systems.example"; // cámbialo por tu dominio real
const SHOW_LOGO = true; // <- ponlo en false si quieres mostrar solo el texto “CK Systems”

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  const text = JSON.stringify(data);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

const LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Servicios", to: "/services" },
  { label: "Proyectos", to: "/projects" },
  { label: "Nosotros", to: "/about" },
  { label: "Contacto", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Cambia el estilo del header al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SEO: canonical + JSON-LD
  useEffect(() => {
    const canonical = `${BASE_URL}${pathname === "/" ? "/" : pathname}`;
    upsertLink("canonical", canonical);
    upsertJsonLd("org-jsonld", {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CK Systems",
      "url": BASE_URL + "/",
      "logo": BASE_URL + "/logo.png",
    });
  }, [pathname]);

  // Cierra menú al navegar
  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape y scroll lock para el menú móvil
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#main-content" className="sr-only focusable">Saltar al contenido</a>

      <header
        className={[
          "fixed top-0 left-0 w-full z-50 transition",
          scrolled ? "bg-brand-navy/90 backdrop-blur border-b border-white/10" : "bg-transparent"
        ].join(" ")}
      >
        <nav className="mx-auto max-w-6xl h-20 px-4 flex items-center justify-between" aria-label="Navegación principal">
          {/* Marca */}
          <Link to="/" className="flex items-center gap-3 no-underline" aria-label="Ir al inicio">
            {SHOW_LOGO ? (
              <>
                <img
                  src={logo}
                  alt="CK Systems"
                  className="h-[56px] md:h-[68px] w-auto object-contain"
                  loading="lazy"
                />
                <span className="sr-only">CK Systems</span>
              </>
            ) : (
              <span className="text-white text-xl md:text-2xl font-semibold tracking-tight">
                CK Systems
              </span>
            )}
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex gap-7 text-[15px] lg:text-base">
            {LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative group no-underline transition ${
                      isActive ? "text-white font-medium" : "text-white/80 hover:text-white"
                    }`
                  }
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Hamburguesa */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {!open ? (
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>

        {/* Móvil */}
        {open && (
          <div className="md:hidden" aria-hidden={!open}>
            <div className="fixed inset-0 bg-black/40 opacity-100 transition-opacity" onClick={() => setOpen(false)} />
            <div
              id="mobile-menu"
              className="fixed top-20 left-0 right-0 mx-4 rounded-xl border border-white/10 bg-brand-navy/95 backdrop-blur shadow-2xl
                         animate-[menuSlideDown_180ms_ease-out] origin-top"
              role="dialog"
              aria-modal="true"
            >
              <style>{`
                @keyframes menuSlideDown {
                  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
              <ul className="py-2">
                {LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-base no-underline ${
                          isActive ? "text-white font-medium" : "text-white/80 hover:text-white hover:bg-white/5"
                        }`
                      }
                      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
