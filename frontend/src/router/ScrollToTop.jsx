import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hace scroll al tope cada vez que cambia el pathname (nueva página).
 * No actúa sobre cambios de hash (#).
 */
export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior }); // "auto" o "smooth"
  }, [pathname, behavior]);

  return null;
}
