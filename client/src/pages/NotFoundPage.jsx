import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-8xl font-extrabold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-2xl font-bold text-surface-800 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-surface-500 dark:text-surface-400 mt-2 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><Button variant="primary" icon={Home}>Back to Home</Button></Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;