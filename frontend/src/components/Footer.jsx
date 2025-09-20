// src/components/Footer.jsx
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#0b1424]">
      {/* línea sutil arriba */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(21,112,239,.35),transparent)" }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        {/* Marca */}
        <div className="flex flex-col items-start">
          <img
            src={logo}
            alt="CK Systems"
            className="h-28 md:h-32 w-auto object-contain -mt-8"  // más grande y un poco más arriba
            loading="lazy"
          />
          <p className="mt-3 text-white/70 text-left">
            Soluciones tecnológicas: desarrollo web, automatización, domótica y soporte.
          </p>
          {/* Copyright se movió a la franja inferior */}
        </div>

        {/* Servicios */}
        <div>
          <p className="text-white font-semibold mb-3">Servicios</p>
          <ul className="space-y-2 text-white/80">
            <li><a href="#" className="hover:text-white hover:underline underline-offset-4">Automatización</a></li>
            <li><a href="#" className="hover:text-white hover:underline underline-offset-4">Desarrollo web</a></li>
            <li><a href="#" className="hover:text-white hover:underline underline-offset-4">Domótica</a></li>
            <li><a href="#" className="hover:text-white hover:underline underline-offset-4">Mantenimiento en hardware y software</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-white font-semibold mb-3">Contacto</p>
          <ul className="space-y-2 text-white/80">
            <li>Catamayo — Loja — Ecuador</li>
            <li>
              <a href="mailto:davidajila07@gmail.com" className="hover:text-white hover:underline underline-offset-4">
                davidajila07@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+593994494004" className="hover:text-white hover:underline underline-offset-4">
                099 449 4004
              </a>
            </li>
          </ul>

          {/* Redes (sin cambios) */}
          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://www.facebook.com/CKSystems"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/70 hover:text-white transition"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.8-3.88 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.89h2.79l-.45 2.9h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/ck_systems/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/70 hover:text-white transition"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
              </svg>
            </a>
          </div>

          {/* Privacidad/Términos debajo de Instagram */}
          <div className="mt-3 text-xs text-white/60">
            <a href="/privacy" className="hover:text-white hover:underline underline-offset-4">Política de privacidad</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="hover:text-white hover:underline underline-offset-4">Términos y condiciones</a>
          </div>
        </div>
      </div>

      {/* Franja legal inferior: sólo copyright */}
      <div className="border-t border-white/10 py-4">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-white/60">
          © {year} CK Systems. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
