import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import getIcon from './utils/iconUtils';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    toast.info(
      `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      { autoClose: 1500 }
    );
  };

  const Sun = getIcon('Sun');
  const Moon = getIcon('Moon');

  return (
      <Navigation isDarkMode={isDarkMode} />
    <div className="min-h-screen">
      <button
        aria-label="Toggle dark mode"
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary/90 text-white shadow-soft hover:bg-primary transition-all duration-300"
        onClick={toggleDarkMode}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        style={{ fontSize: '0.875rem' }}
        toastClassName={() => 
          "relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer mt-4 mb-2"
        }
      />
    </div>
  );
}

export default App;