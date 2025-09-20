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
 * - En "contact" hace remolino y cambia 5s a robotcel.png.
 * - En móvil se ubica cerca del INICIO de cada sección (top fijo en vh).
 */
export default function FloatingRobot({
  sections = ["hero", "about", "services", "team", "contact"],
  startSide = "right",
  /** Forzar lado por sección: { [id]: 'left' | 'right' } */
  sideOverrides = {
    hero: "right",
    about: "left",
    services: "right",
    team: "left",
    contact: "right",
  },
  /** Altura (en % del viewport) por sección en desktop */
  offsetTopVH = { hero: 30, default: 18, mobile: 86 },
  /** Altura en móvil (porcentaje del viewport, recomendado 8–14) */
  mobileTopVH = 12, // 👈 NUEVO: “inicio” de cada sección en móvil
  marginPx = 28,
  marginPxMobile = 14,
  /** Qué tan cerca del ancla en HERO (px) */
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

  // ===== Lado por sección (override > alternancia) =====
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

    // HERO: si hay ancla, úsala para quedar cerca de “Systems”
    if (currentId === "hero") {
      const el = document.getElementById("robot-anchor");
      if (el) {
        const r = el.getBoundingClientRect();
        const anchorRight = r.left + r.width;
        const forward = isSmall ? heroOffsetForwardMobile : heroOffsetForward;
        const xHero = anchorRight + forward;
        const minX = margin;
        const maxX = vw - margin - robotW;
        return Math.min(Math.max(minX, xHero), maxX);
      }
    }

    return side === "right" ? vw - margin - robotW : margin;
  };

  // X inicial (aparece ya en su sitio en HERO)
  const computeInitialX = () => {
    const margin = isSmall ? marginPxMobile : marginPx;
    const el = document.getElementById("robot-anchor");
    if (el) {
      const r = el.getBoundingClientRect();
      const anchorRight = r.left + r.width;
      const forward = isSmall ? heroOffsetForwardMobile : heroOffsetForward;
      const xHero = anchorRight + forward;
      const minX = margin;
      const maxX = vw - margin - robotW;
      return Math.min(Math.max(minX, xHero), maxX);
    }
    // fallback por lado
    return sideOverrides?.hero === "right" ? vw - margin - robotW : margin;
  };

  // TOP objetivo
  const computeTargetTop = () => {
    if (isSmall) {
      // En móvil nos ubicamos cerca del INICIO de cada sección
      const topPercent = mobileTopVH ?? offsetTopVH.mobile ?? 12;
      return (topPercent / 100) * vh;
    }
    const vhVal = offsetTopVH[currentId] ?? offsetTopVH.default ?? 18;
    return (vhVal / 100) * vh;
  };

  // ===== Motion values =====
  const x = useMotionValue(computeInitialX()); // arranca pegado al anchor
  const xSmooth = useSpring(x, { stiffness: 50, damping: 24, mass: 0.8 });
  const topPx = useMotionValue(computeTargetTop());
  const topSmooth = useSpring(topPx, { stiffness: 44, damping: 22, mass: 0.9 });

  const { scrollY } = useScroll();
  const yRaw = useTransform(
    scrollY,
    [0, isSmall ? 800 : 1200],
    [0, isSmall ? -16 : -34]
  );
  const y = useSpring(yRaw, { stiffness: 30, damping: 18, mass: 0.9 });

  // Tilt por velocidad (más suave en móvil)
  const vX = useVelocity(xSmooth);
  const tilt = useTransform(vX, [-1200, 0, 1200], isSmall ? [-2.5, 0, 2.5] : [-5, 0, 5]);

  // ===== Remolino en "contact" + swap de imagen 5s =====
  const [useCelImage, setUseCelImage] = useState(false);
  const spinningRef = useRef(false);
  const armedRef = useRef(false);
  const spinMV = useMotionValue(0);
  const spinSmooth = useSpring(spinMV, { stiffness: 120, damping: 22, mass: 0.8 });

  // Mover a nuevos targets cuando cambia la sección / viewport
  useEffect(() => {
    const controls = [
      animate(x, computeTargetX(), {
        type: "spring",
        stiffness: 50,
        damping: 24,
        mass: 0.8,
        restDelta: 0.2,
        delay: 0.02,
      }),
      animate(topPx, computeTargetTop(), {
        type: "spring",
        stiffness: 44,
        damping: 22,
        mass: 0.9,
        restDelta: 0.2,
      }),
    ];
    return () => controls.forEach((c) => c.stop && c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, vw, vh, isSmall, side, mobileTopVH]);

  // Trigger remolino solo en contact
  useEffect(() => {
    if (currentId === "contact") {
      if (!armedRef.current && !spinningRef.current) {
        armedRef.current = true;
        spinningRef.current = true;

        (async () => {
          await animate(spinMV, 720, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(true);
          await new Promise((res) => setTimeout(res, 5000));
          await animate(spinMV, 1440, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(false);
          spinMV.set(0);
          spinningRef.current = false;
        })();
      }
    } else {
      armedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

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
            rotate: tilt,
            width: robotW,
            height: "auto",
            filter:
              "drop-shadow(0 10px 24px rgba(0,0,0,0.40)) drop-shadow(0 0 10px rgba(86,191,255,0.35))",
          }}
          initial={{ opacity: 1, scale: 1 }}  // aparece ya flotando
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 36, damping: 20, mass: 0.9 }}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}
