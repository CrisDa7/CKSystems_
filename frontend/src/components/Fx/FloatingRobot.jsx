// src/components/Fx/FloatingRobot.jsx
import { useEffect, useMemo, useRef, useState } from "react";
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
 * Robot flotante con neón celeste + animación pro.
 * Extra: en la sección "contact" hace remolino, cambia a robotcel.png 5s,
 * vuelve a girar y retorna a robot.png.
 */
export default function FloatingRobot({
  sections = ["hero", "about", "services", "team", "contact"],
  startSide = "right",
  offsetTopVH = { hero: 30, default: 18, mobile: 86 },
  marginPx = 28,
  marginPxMobile = 14,
  heroOffsetForward = 36,
  heroOffsetForwardMobile = 16,
  widthPx = { base: 220, md: 300, xl: 340, sm: 150 },
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [anchorX, setAnchorX] = useState(null);
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

  // ===== Estilos de halo neón (una vez) =====
  useEffect(() => {
    const id = "ck-floating-robot-neon-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes ck-glow-pulse {
        0% { opacity: .55; transform: scale(1);   }
        50%{ opacity: .85; transform: scale(1.05);}
        100%{opacity: .55; transform: scale(1);   }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  // ===== Medir anchor del Hero (detrás de "Systems") + responsive =====
  useEffect(() => {
    const update = () => {
      const el = document.getElementById("robot-anchor");
      if (el) {
        const r = el.getBoundingClientRect();
        // pegadito al texto; ajusta -28 si quieres más/menos
        setAnchorX(r.left + r.width - 28);
      }
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      setIsSmall(window.matchMedia("(max-width: 768px)").matches);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ===== Detectar sección activa (la más visible) =====
  useEffect(() => {
    const nodes = sections.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = [...entries].sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio
        )[0];
        if (best?.isIntersecting) {
          const idx = nodes.findIndex((n) => n === best.target);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      { threshold: [0.35, 0.6, 0.8] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  // ===== Lado alternado por índice =====
  const sideForIdx = (idx) => {
    const startRight = startSide === "right";
    const isRight = startRight ? idx % 2 === 0 : idx % 2 !== 0;
    return isRight ? "right" : "left";
  };

  // ===== Tamaño del robot =====
  const robotW =
    vw >= 1280 ? widthPx.xl :
    vw >= 768  ? widthPx.md :
                 widthPx.sm;

  // ===== Posiciones target (X y TOP) =====
  const currentId = sections[activeIdx];
  const side = sideForIdx(activeIdx);

  const computeTargetX = () => {
    const margin = isSmall ? marginPxMobile : marginPx;
    if (currentId === "hero" && anchorX != null) {
      return anchorX + (isSmall ? heroOffsetForwardMobile : heroOffsetForward);
    }
    if (side === "right") return vw - margin - robotW;
    return margin;
  };

  const computeTargetTop = () => {
    if (isSmall) {
      const pxFromBottom = (offsetTopVH.mobile / 100) * vh;
      return Math.max(0, vh - pxFromBottom - robotW * 0.55);
    }
    const vhVal =
      (currentId === "hero" ? offsetTopVH.hero : offsetTopVH[currentId]) ??
      offsetTopVH.default;
    return (vhVal / 100) * vh;
  };

  // ===== Motion values suaves =====
  const x = useMotionValue(computeTargetX());
  const xSmooth = useSpring(x, { stiffness: 42, damping: 22, mass: 0.8 });
  const topPx = useMotionValue(computeTargetTop());
  const topSmooth = useSpring(topPx, { stiffness: 38, damping: 20, mass: 0.9 });

  const { scrollY } = useScroll();
  const yRaw = useTransform(
    scrollY,
    [0, isSmall ? 800 : 1200],
    [0, isSmall ? -16 : -34]
  );
  const y = useSpring(yRaw, { stiffness: 30, damping: 18, mass: 0.9 });

  // Rotación sutil por velocidad (tilt)
  const vX = useVelocity(xSmooth);
  const tilt = useTransform(
    vX,
    [-1200, 0, 1200],
    isSmall ? [-3.5, 0, 3.5] : [-5.5, 0, 5.5]
  );

  // ===== Remolino en "contact" + swap de imagen 5s =====
  const [useCelImage, setUseCelImage] = useState(false);
  const spinningRef = useRef(false);      // evita retriggers mientras corre
  const armedRef = useRef(false);         // se rearma al salir de contact
  const spinMV = useMotionValue(0);       // rotación extra (remolino)
  const spinSmooth = useSpring(spinMV, { stiffness: 120, damping: 22, mass: 0.8 });

  // Cuando cambia de sección o viewport, mover a nuevos targets
  useEffect(() => {
    const controls = [
      animate(x, computeTargetX(), {
        type: "spring",
        stiffness: 42,
        damping: 22,
        mass: 0.8,
        restDelta: 0.2,
        delay: 0.04,
      }),
      animate(topPx, computeTargetTop(), {
        type: "spring",
        stiffness: 38,
        damping: 20,
        mass: 0.9,
        restDelta: 0.2,
      }),
    ];
    return () => controls.forEach((c) => c.stop && c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, anchorX, vw, vh, isSmall]);

  // Disparar remolino SOLO al entrar a "contact"
  useEffect(() => {
    if (currentId === "contact") {
      if (!armedRef.current && !spinningRef.current) {
        armedRef.current = true;
        spinningRef.current = true;

        (async () => {
          // giro de entrada
          await animate(spinMV, 720, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(true); // ¡bum! cambia imagen
          // mantener 5s en modo celeste  ⬅️ (antes era 2s)
          await new Promise((res) => setTimeout(res, 5000));
          // giro de salida
          await animate(spinMV, 1440, { duration: 0.7, ease: "easeInOut" });
          setUseCelImage(false);
          // reset para no acumular grados
          spinMV.set(0);
          spinningRef.current = false;
        })();
      }
    } else {
      // salimos de contact → rearmar
      armedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  return (
    <motion.div
      // Bob continuo leve
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
      {/* Capa de remolino (rota todo el conjunto) */}
      <motion.div style={{ rotate: spinSmooth }}>
        {/* Halo de neón celeste */}
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
            translateY: y,  // parallax amortiguado
            rotate: tilt,   // inclinación suave
            width: robotW,
            height: "auto",
            filter:
              "drop-shadow(0 10px 24px rgba(0,0,0,0.40)) drop-shadow(0 0 10px rgba(86,191,255,0.35))",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 36, damping: 20, mass: 0.9 }}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}
