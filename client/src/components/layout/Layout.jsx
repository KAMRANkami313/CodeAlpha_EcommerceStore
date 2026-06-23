import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import { Toaster } from 'react-hot-toast';

/**
 * Layout — Editorial Modern Redesign
 *
 * The structural shell of ShopVerse. Single subtle backdrop glow,
 * refined toast configuration, polished spacing.
 */
const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 transition-colors duration-300 mesh-bg-soft overflow-x-hidden">

      {/* Subtle top glow (single, restrained) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-primary-500/5 to-transparent pointer-events-none z-0" />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-sans)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid rgba(28, 25, 23, 0.06)',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />

      {/* Header navigation */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 relative z-10 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating scroll-to-top */}
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;