// Componente SEO sin dependencias para React 19.
// Escribe <title>, metas (description, keywords, canonical, OG, Twitter)
// y un bloque JSON-LD opcional (schema.org).
// Comentarios en español para guiarte.

import { useEffect } from "react";

function upsertMeta(name, key, value) {
  let el = document.head.querySelector(`meta[${name}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(name, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  return el;
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

function upsertScriptJsonLd(id, json) {
  let el = document.getElementById(id);
  const content = JSON.stringify(json);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    el.text = content;
    document.head.appendChild(el);
  } else {
    el.text = content;
  }
  return el;
}

export default function Seo({
  title = "CK Systems — Soluciones tecnológicas",
  description = "Automatización, desarrollo web, domótica y soporte IT con foco en rendimiento y calidad.",
  keywords = ["automatización", "desarrollo web", "domótica", "soporte IT", "CK Systems"],
  canonical = "https://www.ck-systems.example/", // ⬅️ reemplaza por tu dominio real
  ogImage = "/og-default.png",                    // ⬅️ coloca esta imagen en /public (1200x630)
  siteName = "CK Systems",
  lang = "es",
  twitterHandle = "@cksystems",                   // ⬅️ opcional: tu @ si lo tienes
  jsonLd = null,                                  // ⬅️ objeto schema.org (opcional)
}) {
  useEffect(() => {
    // idioma html
    document.documentElement.setAttribute("lang", lang);

    // título (guardar y restaurar en unmount)
    const prevTitle = document.title;
    document.title = title;

    // metas base
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", Array.isArray(keywords) ? keywords.join(", ") : String(keywords || ""));
    upsertLink("canonical", canonical);

    // Open Graph
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:site_name", siteName);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
    if (twitterHandle) upsertMeta("name", "twitter:site", twitterHandle);

    // theme-color
    upsertMeta("name", "theme-color", "#0B1220");

    // JSON-LD (schema.org)
    if (jsonLd) upsertScriptJsonLd("seo-jsonld", jsonLd);

    return () => {
      document.title = prevTitle;
      // Nota: no removemos metas para evitar parpadeos entre rutas
    };
  }, [title, description, keywords, canonical, ogImage, siteName, lang, twitterHandle, jsonLd]);

  return null; // no renderiza nada
}
