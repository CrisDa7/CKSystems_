import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  animate,
} from "framer-motion";
import robotSrc from "../../assets/imgHome/robot.png";
import robotCelSrc from "../../assets/imgHome/robotcel.png";

/**
 * Robot flotante con halo neón.
 * - Lado fijo por sección con sideOverrides.
 * - Activa sección por "centro de pantalla".
 * - En móvil: inicia centrado sobre el título del hero, luego se ubica al inicio de cada sección.
 * - En "contact": cambia a robotcel.png, hace giro de entrada y luego balanceo horizontal (cada 2s).
 *   Al salir de "contact": giro de salida y vuelve a la imagen original.
 */
export default function FloatingRobot({
  sections = ["hero", "about", "services", "team", "contact"],
  startSide = "right",
  sideOverrides = {
    hero: "right",
    about: "left",
    services: "right",
    team: "left",
    contact: "right",
  },
  // Alturas (desktop por sección) y móvil (inicio de cada sección)
  offsetTopVH = { hero: 30, default: 18, mobile: 86 },
  mobileTopVH = 12,

  marginPx = 28,
  marginPxMobile = 14,

  // Fino contra el anchor en hero (desktop/móvil)
  heroOffsetForward = 12,
  heroOffsetForwardMobile = 8,

  widthPx = { base: 220, md: 300, xl: 340, sm: 150 },
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [vh, setVh] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  // ===== Estilo halo (una vez) =====
  useEffect(() => {
    const id = "ck-floating-robot-neon-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes ck-glow-pulse {
        0% { opacity: .55; transform: scale(1); }
        50%{ opacity: .85; transform: scale(1.05); }
        100%{ opacity: .55; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  // ===== Responsive =====
  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      setIsSmall(window.matchMedia("(max-width: 768px)").matches);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== Helper: rect del anchor del HERO (preferimos #robot-anchor; fallback <h1>) =====
  const getHeroAnchorRect = () => {
    const hero = document.getElementById("hero");
    if (!hero) return null;
    const el =
      document.getElementById("robot-anchor") ||
      hero.querySelector("[data-robot-anchor]" ) ||
      hero.querySelector("h1");
    return el ? el.getBoundingClientRect() : null;
  };

  // ===== Detectar sección activa por CENTRO de viewport =====
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    let raf = 0;
    const pickByCenter = () => {
      const center = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActiveIdx(bestIdx);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pickByCenter);
    };

    pickByCenter(); // inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  // ===== Lado por sección =====
  const sideFor = (id, idx) => {
    if (sideOverrides && Object.prototype.hasOwnProperty.call(sideOverrides, id)) {
      return sideOverrides[id];
    }
    const startRightBool = startSide === "right";
    const isRight = startRightBool ? idx % 2 === 0 : idx % 2 !== 0;
    return isRight ? "right" : "left";
  };

  // ===== Tamaño del robot =====
  const robotW =
    vw >= 1280 ? widthPx.xl :
    vw >= 768  ? widthPx.md :
                 widthPx.sm;

  // ===== Posiciones target =====
  const currentId = sections[activeIdx];
  const side = sideFor(currentId, activeIdx);

  // X objetivo
  const computeTargetX = () => {
    const margin = isSmall ? marginPxMobile : marginPx;

    // HERO: alineado al anchor; en móvil ya partimos centrados, aquí mantenemos lado forzado
    if (!isSmall && currentId === "hero") {
      const r = getHeroAnchorRect();
      if (r) {
        const xHero = r.left + r.width + heroOffsetForward;
        const minX = margin;
        const maxX = vw - margin - robotW;
        return Math.min(Math.max(minX, xHero), maxX);
      }
    }

    return side === "right" ? vw - margin - robotW : margin;
  };

  // X inicial
  const computeInitialX = () => {
    const margin = isSmall ? marginPxMobile : marginPx;

    // En móvil + HERO: centrar sobre el título
    if (isSmall) {
      const r = getHeroAnchorRect();
      const centerX = r ? r.left + r.width / 2 : vw / 2;
      const x = centerX - robotW / 2;
      const minX = margin;
      const maxX = vw - margin - robotW;
      return Math.min(Math.max(minX, x), maxX);
    }

    // Desktop + HERO: junto al anchor a la derecha
    if (currentId === "hero") {
      const r = getHeroAnchorRect();
      if (r) {
        const xHero = r.left + r.width + heroOffsetForward;
        const minX = margin;
        const maxX = vw - margin - robotW;
        return Math.min(Math.max(minX, xHero), maxX);
      }
    }

    // Fallback por lado
    return sideOverrides?.hero === "right" ? vw - margin - robotW : margin;
  };

  // TOP objetivo
  const computeTargetTop = () => {
    if (isSmall) {
      // En móvil: al inicio de cada sección
      const topPercent = mobileTopVH ?? offsetTopVH.mobile ?? 12;
      return (topPercent / 100) * vh;
    }
    const vhVal = offsetTopVH[currentId] ?? offsetTopVH.default ?? 18;
    return (vhVal / 100) * vh;
  };

  // TOP inicial
  const computeInitialTop = () => {
    if (isSmall) {
      // Colocar por ENCIMA del título del hero en móvil
      const r = getHeroAnchorRect();
      if (r) {
        return Math.max(8, r.top - robotW * 0.7);
      }
      return (mobileTopVH / 100) * vh;
    }
    return computeTargetTop();
  };

  // ===== Motion values =====
  const x = useMotionValue(computeInitialX());
  const xSmooth = useSpring(x, { stiffness: 50, damping: 24, mass: 0.8 });

  const topPx = useMotionValue(computeInitialTop());
  const topSmooth = useSpring(topPx, { stiffness: 44, damping: 22, mass: 0.9 });

  const { scrollY } = useScroll();
  const yRaw = useTransform(
    scrollY,
    [0, isSmall ? 800 : 1200],
    [0, isSmall ? -16 : -34]
  );
  const y = useSpring(yRaw, { stiffness: 30, damping: 18, mass: 0.9 });

  // Tilt por velocidad (ligero)
  const vX = useVelocity(xSmooth);
  const tilt = useTransform(vX, [-1200, 0, 1200], isSmall ? [-2.5, 0, 2.5] : [-5, 0, 5]);

  // ===== Remolino puntual (entrada/salida de contact) =====
  const [useCelImage, setUseCelImage] = useState(false);
  const spinningRef = useRef(false); // evita animaciones concurrentes
  const spinMV = useMotionValue(0);
  const spinSmooth = useSpring(spinMV, { stiffness: 120, damping: 22, mass: 0.8 });

  // ===== Wobble (balanceo lateral continuo en contact) =====
  const wobbleMV = useMotionValue(0);
  const wobbleSmooth = useSpring(wobbleMV, { stiffness: 120, damping: 18, mass: 0.8 });
  const wobbleAnimRef = useRef(null);

  // Rotación final combinada: tilt por velocidad + wobble cuando esté en contact
  const rotateCombined = useTransform([tilt, wobbleSmooth], ([t, w]) => t + w);

  // Evitar que al primer render se mueva de la posición inicial móvil del hero
  const firstRunRef = useRef(true);

  // Mover a nuevos targets cuando cambia la sección / viewport
  useEffect(() => {
    const anims = [];

    if (firstRunRef.current) {
      firstRunRef.current = false;
    } else {
      anims.push(
        animate(x, computeTargetX(), {
          type: "spring",
          stiffness: 50,
          damping: 24,
          mass: 0.8,
          restDelta: 0.2,
          delay: 0.02,
        })
      );
      anims.push(
        animate(topPx, computeTargetTop(), {
          type: "spring",
          stiffness: 44,
          damping: 22,
          mass: 0.9,
          restDelta: 0.2,
        })
      );
    }

    return () => anims.forEach((a) => a?.stop && a.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, vw, vh, isSmall, side, mobileTopVH]);

  // Entrada/salida de "contact": giro + swap persistente + wobble on/off
  useEffect(() => {
    const isInContact = sections[activeIdx] === "contact";

    // Si vamos a activar wobble: crear animación infinita
    const startWobble = () => {
      wobbleAnimRef.current?.stop?.();
      // balanceo horizontal suave: -6° -> 6° -> -6° en 2s
      wobbleAnimRef.current = animate(wobbleMV, [-6, 6, -6], {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      });
    };

    const stopWobble = async () => {
      wobbleAnimRef.current?.stop?.();
      await animate(wobbleMV, 0, { duration: 0.25, ease: "easeOut" });
    };

    if (spinningRef.current) return;

    (async () => {
      try {
        if (isInContact && !useCelImage) {
          // Entrando a contact: giro de entrada + swap + comenzar wobble
          spinningRef.current = true;
          await animate(spinMV, 720, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(true);
          spinMV.set(0);
          spinningRef.current = false;
          startWobble();
        } else if (!isInContact && useCelImage) {
          // Saliendo de contact: parar wobble + giro de salida + volver a imagen normal
          await stopWobble();
          spinningRef.current = true;
          await animate(spinMV, 1440, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(false);
          spinMV.set(0);
          spinningRef.current = false;
        } else if (isInContact && useCelImage) {
          // Ya en contact y con imagen cel: asegurar wobble activo (por si se perdió)
          if (!wobbleAnimRef.current) startWobble();
        } else {
          // Fuera de contact: asegurar wobble apagado
          if (wobbleAnimRef.current) {
            await stopWobble();
          }
        }
      } catch {
        spinningRef.current = false;
      }
    })();

    return () => {
      // limpieza si desmonta o cambia rápido
      if (!isInContact && wobbleAnimRef.current) {
        wobbleAnimRef.current.stop?.();
        wobbleAnimRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, sections, useCelImage]);

  return (
    <motion.div
      animate={{ y: [0, -3, 0, 2, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: [0.33, 0.0, 0.33, 1] }}
      style={{
        position: "fixed",
        top: topSmooth,
        left: xSmooth,
        zIndex: 40,
        pointerEvents: "none",
        willChange: "transform, filter",
      }}
    >
      {/* spinSmooth solo se usa para los giros de entrada/salida */}
      <motion.div style={{ rotate: spinSmooth }}>
        {/* Halo */}
        <motion.span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-18%",
            borderRadius: "9999px",
            background:
              "radial-gradient(closest-side, rgba(86,191,255,0.35), rgba(86,191,255,0.20) 40%, rgba(86,191,255,0.06) 70%, transparent 80%)",
            filter:
              "blur(14px) drop-shadow(0 0 18px rgba(86,191,255,0.35)) drop-shadow(0 0 36px rgba(21,112,239,0.25))",
            pointerEvents: "none",
          }}
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.05, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Robot */}
        <motion.img
          src={useCelImage ? robotCelSrc : robotSrc}
          alt="Robot CK flotante"
          draggable={false}
          style={{
            translateY: y,
            rotate: rotateCombined, // tilt + wobble (si está en contact)
            width: robotW,
            height: "auto",
            filter:
              "drop-shadow(0 10px 24px rgba(0,0,0,0.40)) drop-shadow(0 0 10px rgba(86,191,255,0.35))",
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 36, damping: 20, mass: 0.9 }}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}
