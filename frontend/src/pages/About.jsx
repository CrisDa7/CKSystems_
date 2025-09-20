import Seo from "../seo/Seo";
const BASE = "https://www.ck-systems.example";

export default function About() {
  return (
    <>
      <Seo
        title="Nosotros — CK Systems"
        description="Conoce la misión, visión y valores de CK Systems. Expertos en soluciones tecnológicas eficientes."
        keywords={["CK Systems","nosotros","equipo","misión","visión"]}
        canonical={`${BASE}/about`}
        ogImage="/og-default.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "Nosotros — CK Systems",
          "url": `${BASE}/about`
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">About…</div>
    </>
  );
}
