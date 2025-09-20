import Seo from "../seo/Seo";
const BASE = "https://www.ck-systems.example";

export default function Projects() {
  return (
    <>
      <Seo
        title="Proyectos — CK Systems"
        description="Casos de éxito y proyectos seleccionados en desarrollo web, automatización y domótica."
        keywords={["proyectos","portafolio","casos de éxito","CK Systems"]}
        canonical={`${BASE}/projects`}
        ogImage="/og-default.png"
      />
      <div className="mx-auto max-w-6xl px-4 py-16">Projects…</div>
    </>
  );
}
