// src/pages/ProjectDetail.jsx
import { Link, useParams } from "react-router-dom";
import Seo from "../seo/Seo";
import { PROJECTS, SERVICES } from "../data/projects";

const BASE = "https://www.ck-systems.example"; // cámbialo por el real

export default function ProjectDetail() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <h1 className="text-2xl font-semibold">Proyecto no encontrado</h1>
        <p className="mt-2 text-white/70">
          Verifica el enlace o vuelve a la lista de proyectos.
        </p>
        <div className="mt-6">
          <Link
            to="/projects"
            className="px-4 py-2 rounded-md bg-brand-blue text-white hover:bg-brand-blueDark transition no-underline"
          >
            ← Volver a proyectos
          </Link>
        </div>
      </section>
    );
  }

  const serviceLabel =
    SERVICES.find((s) => s.key === project.serviceKey)?.label ??
    project.serviceKey;

  const images = project.images?.length ? project.images : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "about": serviceLabel,
    "description": project.summary,
    "url": `${BASE}/projects/id/${project.id}`,
    "image": images[0] || "",
  };

  return (
    <>
      <Seo
        title={`Proyecto — ${project.title}`}
        description={project.summary || `Proyecto de ${serviceLabel}`}
        canonical={`${BASE}/projects/id/${project.id}`}
        ogImage={images[0] || "/og-default.png"}
        siteName="CK Systems"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative w-full bg-brand-navy">
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-10">
          <p className="text-xs uppercase tracking-widest text-brand-sky">
            Proyecto
          </p>
          <div className="mt-2 flex items-end gap-4">
            <h1 className="text-3xl md:text-4xl font-semibold">
              {project.title}
            </h1>
            <span className="hidden md:inline-block h-[2px] w-24 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/80 border border-white/10">
              {serviceLabel}
            </span>
            <Link
              to="/projects"
              className="text-sm text-brand-sky hover:text-white underline-offset-4 hover:underline"
            >
              ← Volver a proyectos
            </Link>
          </div>
          {project.summary && (
            <p className="mt-3 text-white/70 max-w-2xl">{project.summary}</p>
          )}
        </div>
      </section>

      {/* Galería sencilla (cover grande + grid) */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {images.length > 0 && (
          <>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <img
                src={images[0]}
                alt=""
                className="w-full h-[46vh] md:h-[56vh] object-contain bg-black/30"
                loading="eager"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.slice(1).map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-lg border border-white/10 bg-black/15 hover:border-white/25 transition"
                    title="Abrir imagen en pestaña nueva"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-48 object-cover opacity-95"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-8 flex gap-3">
          <a
            href={`https://wa.me/593994494004?text=${encodeURIComponent(
              `Hola, me interesa un proyecto similar a: ${project.title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-brand-blue text-white hover:bg-brand-blueDark transition no-underline"
          >
            Quiero algo así
          </a>
          <Link
            to="/projects"
            className="px-4 py-2 rounded-md border border-white/15 text-white/90 hover:bg-white/10 transition no-underline"
          >
            Volver
          </Link>
        </div>
      </section>
    </>
  );
}
