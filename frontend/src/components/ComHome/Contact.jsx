// src/components/ComHome/Contact.jsx
import { useEffect, useState } from "react";
import contactImg from "../../assets/imgHome/contacto.png";

const BASE = "https://www.ck-systems.example";

export default function Contact() {
  const [form, setForm] = useState({
    ciudad: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const elId = "contact-jsonld";
    const data = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contáctanos",
      "url": BASE + "/",
      "mainEntity": {
        "@type": "Organization",
        "name": "CK Systems",
        "url": BASE + "/",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "areaServed": "EC",
          "availableLanguage": ["es"],
          "telephone": "+593994494004",
          "email": "info@ck-systems.example"
        }
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

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const to = "593994494004";
    const text = [
      "Nuevo contacto desde CK Systems",
      `Ciudad: ${form.ciudad}`,
      `Nombre: ${form.nombre} ${form.apellido}`,
      `Teléfono: ${form.telefono}`,
      `Email: ${form.email}`,
      `Mensaje: ${form.mensaje}`,
    ].join("\n");
    window.open(`https://wa.me/${to}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ ciudad: "", nombre: "", apellido: "", telefono: "", email: "", mensaje: "" });
  };

  return (
    <section id="contact" className="relative bg-brand-navy" aria-labelledby="contact-title">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img src={contactImg} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-0 bg-[#050c18]/78" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Contenido (subido más) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-4 md:pt-6 pb-6 md:pb-8">
        <p className="text-xs uppercase tracking-widest text-brand-sky">Contacto</p>
        <div className="mt-2 flex items-end gap-4">
          <h2 id="contact-title" className="text-3xl md:text-4xl font-semibold">Contáctanos</h2>
          <span className="hidden md:inline-block h-[2px] w-24 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-2 md:mt-3 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]"
        >
          <p className="text-white/85">Cuéntanos sobre tu proyecto y te responderemos a la brevedad.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-white/70 mb-1">Ciudad</label>
              <input
                type="text" name="ciudad" value={form.ciudad} onChange={onChange}
                placeholder="Quito, Cuenca…"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Nombre</label>
              <input
                type="text" name="nombre" value={form.nombre} onChange={onChange} placeholder="Juan"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Apellido</label>
              <input
                type="text" name="apellido" value={form.apellido} onChange={onChange} placeholder="Pérez"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Teléfono</label>
              <input
                type="tel" name="telefono" value={form.telefono} onChange={onChange} placeholder="099 123 4567"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-1">Correo electrónico</label>
              <input
                type="email" name="email" value={form.email} onChange={onChange} placeholder="tu@email.com"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-1">¿Cómo podemos ayudarte?</label>
              <textarea
                name="mensaje" value={form.mensaje} onChange={onChange} rows={5}
                placeholder="Cuéntanos brevemente tu proyecto o necesidad…"
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-5 py-2.5 text-white hover:bg-brand-blueDark transition"
            >
              Enviar
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {sent && (
            <div className="mt-4 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">
              ¡Mensaje enviado con éxito! Te contactaremos pronto.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
