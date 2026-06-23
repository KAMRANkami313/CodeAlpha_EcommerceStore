import { useState } from 'react';
import { ShoppingBag, Mail, Send, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ROUTES from '../../constants/ROUTES.js';

// Brand social icons (preserved inline SVGs)
const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const YoutubeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

// Trust badges — Lucide icons (no more emojis)
const TRUST_BADGES = [
  { Icon: ShieldCheck, label: 'Secure SSL Encryption' },
  { Icon: Truck,       label: 'Free shipping above PKR 5k' },
  { Icon: RotateCcw,   label: '30-Day Easy Returns' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      toast.success('Subscribed! Check your inbox for a welcome discount.');
      setEmail('');
      setSubscribing(false);
    }, 800);
  };

  const shopLinks = [
    { label: 'All Products',   to: ROUTES.PRODUCTS },
    { label: 'New Arrivals',   to: ROUTES.PRODUCTS + '?sort=newest' },
    { label: 'Electronics',    to: '/products?category=Electronics' },
    { label: 'Clothing',       to: '/products?category=Clothing' },
    { label: 'Accessories',    to: '/products?category=Accessories' },
  ];

  const supportLinks = [
    { label: 'My Account',     to: ROUTES.PROFILE },
    { label: 'My Orders',      to: ROUTES.PROFILE },
    { label: 'Wishlist',       to: ROUTES.WISHLIST },
    { label: 'Shopping Cart',  to: ROUTES.CART },
    { label: 'Help Center',    to: ROUTES.HOME },
  ];

  const socialLinks = [
    { href: 'https://github.com/KAMRANkami313', label: 'GitHub',    Icon: (props) => (<svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>) },
    { href: 'https://linkedin.com/in/muhammad-kamran-aa7620296', label: 'LinkedIn', Icon: (props) => (<svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>) },
    { href: '#', label: 'Twitter',    Icon: TwitterIcon },
    { href: '#', label: 'Instagram',  Icon: InstagramIcon },
    { href: '#', label: 'Facebook',   Icon: FacebookIcon },
    { href: '#', label: 'YouTube',    Icon: YoutubeIcon },
  ];

  return (
    <footer className="relative bg-surface-900 dark:bg-surface-950 text-surface-300 border-t border-surface-800 dark:border-surface-850 mt-auto overflow-hidden">
      {/* Subtle top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

      {/* Newsletter section */}
      <div className="border-b border-surface-850/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="select-none">
              <h3 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight leading-tight">
                Get <span className="gradient-text-animated font-bold">10% off</span> your first order
              </h3>
              <p className="text-sm text-surface-400 mt-2 leading-relaxed">
                Subscribe to our newsletter for exclusive deals, new arrivals, and insider updates.
              </p>
            </div>

            {/* Email subscription form */}
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-850 dark:bg-surface-900 border border-surface-800 text-white placeholder:text-surface-500 text-sm font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {subscribing ? (
                  <svg className="animate-spin h-4 w-4 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 mb-4 no-underline group">
              <div className="w-9 h-9 bg-liner-to-br from-primary-600 to-violet-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white font-display tracking-tight">
                Shop<span className="text-primary-400">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed max-w-xs">
              Your one-stop destination for premium products. Shop with absolute confidence and enjoy a seamless experience.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2 pt-2 select-none">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center bg-surface-850 hover:bg-primary-600 text-surface-300 hover:text-white border border-surface-800 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider select-none">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-surface-400 hover:text-primary-400 transition-colors no-underline text-sm font-medium inline-flex items-center gap-1.5 group">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider select-none">Account</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-surface-400 hover:text-primary-400 transition-colors no-underline text-sm font-medium inline-flex items-center gap-1.5 group">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment + Trust */}
          <div className="space-y-5 select-none">
            <div>
              <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">We Accept</h3>
              <div className="flex flex-wrap gap-1.5">
                {['VISA', 'MC', 'AMEX', 'Stripe', 'PayPal', 'COD'].map((p) => (
                  <div key={p} className="px-2.5 py-1.5 bg-surface-850 dark:bg-surface-900 border border-surface-800 rounded-md text-2xs font-semibold font-mono text-surface-300 tracking-wider hover:bg-surface-800 hover:text-white transition-colors cursor-default">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges — Lucide icons (no more emojis) */}
            <div className="p-4 bg-surface-850/40 rounded-xl border border-surface-800/60 space-y-2">
              {TRUST_BADGES.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-xs font-medium text-surface-300">
                  <Icon className="w-4 h-4 text-primary-400 shrink-0" strokeWidth={2} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-surface-850/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <p className="text-xs text-surface-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} ShopVerse. Built with passion by Muhammad Kamran.
          </p>
          <div className="flex items-center gap-5 text-xs text-surface-500">
            <a href="#" className="hover:text-primary-400 transition-colors no-underline">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors no-underline">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors no-underline">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;