import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const navigate = useNavigate();
  const ArrowLeft = getIcon('ArrowLeft');
  const FileQuestion = getIcon('FileQuestion');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="card p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <FileQuestion size={64} className="text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-6 text-surface-600 dark:text-surface-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Return Home</span>
        </button>
      </div>
    </motion.div>
  );
}