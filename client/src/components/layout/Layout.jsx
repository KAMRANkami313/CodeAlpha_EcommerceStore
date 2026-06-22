import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import { Toaster } from 'react-hot-toast';

/**
 * Layout — Premium Redesign
 *
 * The structural shell of ShopVerse featuring premium soft background mesh gradients,
 * fluid hardware-accelerated transitions, and polished typography spacing.
 */
const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 transition-colors duration-500 ease-in-out mesh-bg-soft overflow-x-hidden">
      
      {/* Structural Backdrop Glows (Luxury Accent) */}
      <div className="absolute top-0 inset-x-0 h-125 bg-linear-to-b from-primary-500/5 dark:from-primary-500/5 to-transparent pointer-events-none z-0" />
      
      {/* Toast Notification Assembly (Styled via global variables) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-sans)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid rgba(15, 23, 42, 0.05)',
            boxShadow: 'var(--shadow-large)',
          },
        }}
      />
      
      {/* Header Navigation Bar */}
      <Navbar />
      
      {/* Main Structural Content Arena */}
      <main className="flex-1 relative z-10 w-full flex flex-col pt-4 pb-12">
        <Outlet />
      </main>
      
      {/* Structural Footer */}
      <Footer />
      
      {/* Floating Scroll To Top System */}
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;