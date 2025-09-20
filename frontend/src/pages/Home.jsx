// src/pages/Home.jsx
import Seo from "../seo/Seo";
import Hero from "../components/ComHome/Hero";
import About from "../components/ComHome/About";
import Services from "../components/ComHome/Services";
import Team from "../components/ComHome/Team";
import Contact from "../components/ComHome/Contact";

const BASE = "https://www.ck-systems.example"; // cambia por tu dominio

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
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Automatización",
                "description": "Integración de procesos con APIs, bots y dashboards.",
                "provider": { "@type": "Organization", "name": "CK Systems" },
                "areaServed": "Ecuador"
              },
              "url": `${BASE}/services#automation`
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Desarrollo web",
                "description": "Sitios y apps con rendimiento y SEO.",
                "provider": { "@type": "Organization", "name": "CK Systems" },
                "areaServed": "Ecuador"
              },
              "url": `${BASE}/services#webdev`
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Domótica",
                "description": "Soluciones inteligentes para hogar y oficina.",
                "provider": { "@type": "Organization", "name": "CK Systems" },
                "areaServed": "Ecuador"
              },
              "url": `${BASE}/services#domotics`
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mantenimiento de computadoras",
                "description": "Optimización, limpieza, backups y soporte.",
                "provider": { "@type": "Organization", "name": "CK Systems" },
                "areaServed": "Ecuador"
              },
              "url": `${BASE}/services#it`
            }
          ]
        }}
      />
      {/* Orden solicitado */}
      <Hero />
      <About />
      <Services />
      <Team />
      <Contact />
    </>
  );
}
