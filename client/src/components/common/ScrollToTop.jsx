import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Editorial Modern Redesign
 *
 * Listens for route changes and scrolls to top smoothly.
 * Renders nothing — purely a side-effect component.
 * Mounted once in App.jsx outside the route tree.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;