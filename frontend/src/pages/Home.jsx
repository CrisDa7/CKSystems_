// src/pages/Home.jsx
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
          "name": "Servicios de CK Systems",
          "itemListElement": [
            // ... (igual que tenías)
          ]
        }}
      />

      {/* Orden solicitado */}
      <Hero />
      <About />
      <Services />
      <Team />
      <Contact />

      {/* Robot flotante arriba de todo el layout */}
      <FloatingRobot
        sections={["hero", "about", "services", "team", "contact"]}
        startSide="right"
        offsetTopVH={{ hero: 30, default: 18 }}
      />
    </>
  );
}
