// src/components/ComHome/Hero.jsx
import heroBg from "../../assets/imgHome/fondoServicios.png";

export default function Hero() {
  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Hero background"
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3">
          Bienvenido a CK Systems
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/85 max-w-2xl mx-auto">
          Empresa dedicada a dar soluciones tecnológicas eficientes.
        </p>

        <div className="flex gap-4 justify-center">
          {/* Botón que hace scroll a la sección de servicios */}
          <button
            type="button"
            onClick={scrollToServices}
            className="px-6 py-3 rounded-md bg-brand-blue text-white font-medium text-lg shadow-md hover:shadow-lg hover:bg-brand-blueDark transition"
          >
            Services
          </button>

          {/* Si quieres mantener Contact como link SPA */}
          {/* <Link to="/contact" className="px-6 py-3 rounded-md border border-white/40 text-white font-medium text-lg hover:bg-white/10 transition no-underline">Contact</Link> */}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80">↓</div>
    </section>
  );
}
