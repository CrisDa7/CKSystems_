import Seo from "../seo/Seo";
import Hero from "../components/ComHome/Hero";
import About from "../components/ComHome/About";
import Services from "../components/ComHome/Services";
import Team from "../components/ComHome/Team";
import Contact from "../components/ComHome/Contact";
import FloatingRobot from "../components/Fx/FloatingRobot";

const BASE = "https://www.ck-systems.example";

export default function Home() {
  return (
    <>
      <Seo
        title="CK Systems — Desarrollo web, automatización y domótica"
        description="Soluciones tecnológicas eficientes: sitios web, automatización de procesos, domótica y soporte IT."
        keywords={["CK Systems","desarrollo web","automatización","domótica","soporte técnico"]}
        canonical={`${BASE}/`}
        ogImage="/og-default.png"
        siteName="CK Systems"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "Servicios de CK Systems",
          itemListElement: [],
        }}
      />

      {/* Secciones con IDs */}
      <section id="hero">
        {/* Ancla para el robot (ideal colocarlo dentro del <Hero/> en la palabra “Systems”) */}
        <span id="robot-anchor" style={{ position: "absolute", inset: 0, width: 0, height: 0 }} />
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="team">
        <Team />
      </section>
      <section id="contact">
        <Contact />
      </section>

      {/* Robot */}
      <FloatingRobot
        sections={["hero", "about", "services", "team", "contact"]}
        startSide="right"
        sideOverrides={{
          hero: "right",
          about: "left",
          services: "right",
          team: "left",
          contact: "right",
        }}
        offsetTopVH={{ hero: 30, default: 18, mobile: 86 }} // desktop
        mobileTopVH={12}                                   // 👈 móvil: “inicio” de cada sección
        heroOffsetForward={12}
        heroOffsetForwardMobile={8}
      />
    </>
  );
}
