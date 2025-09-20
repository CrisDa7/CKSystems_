import Seo from "../seo/Seo";
const BASE = "https://www.ck-systems.example";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contacto — CK Systems"
        description="Hablemos de tu proyecto: solicita una propuesta de desarrollo web, automatización o domótica."
        keywords={["contacto","cotización","propuesta","CK Systems"]}
        canonical={`${BASE}/contact`}
        ogImage="/og-default.png"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contacto — CK Systems",
          "url": `${BASE}/contact`
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">Contact…</div>
    </>
  );
}
