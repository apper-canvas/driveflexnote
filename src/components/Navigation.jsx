import { useState } from 'react';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const Navigation = ({ isDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const FileTextIcon = getIcon('FileText');

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 px-4 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and brand name */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <FileTextIcon size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900 dark:text-white">NotSoIon</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Home</Link>
          <Link to="/documents" className="px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Documents</Link>
          <Link to="/templates" className="px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Templates</Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-3 space-y-1 px-2 mt-2 border-t border-surface-200 dark:border-surface-700">
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Home</Link>
          <Link to="/documents" className="block px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Documents</Link>
          <Link to="/templates" className="block px-3 py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors duration-200">Templates</Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;