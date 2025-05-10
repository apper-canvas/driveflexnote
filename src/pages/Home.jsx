import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

export default function Home() {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [currentWorkspace, setCurrentWorkspace] = useState('Personal');
  const [workspaces, setWorkspaces] = useState([
    { id: 'personal', name: 'Personal', pages: [
      { id: 'p1', name: 'Getting Started', icon: '📘' },
      { id: 'p2', name: 'Tasks', icon: '✅' },
      { id: 'p3', name: 'Ideas', icon: '💡' },
    ]},
    { id: 'work', name: 'Work', pages: [
      { id: 'w1', name: 'Projects', icon: '📊' },
      { id: 'w2', name: 'Meetings', icon: '🗓️' },
    ]},
  ]);
  
  const [currentPage, setCurrentPage] = useState('p1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const Menu = getIcon('Menu');
  const ChevronDown = getIcon('ChevronDown');
  const ChevronRight = getIcon('ChevronRight');
  const FilePlus = getIcon('FilePlus');
  const FolderPlus = getIcon('FolderPlus');
  const Search = getIcon('Search');
  const Settings = getIcon('Settings');
  const Plus = getIcon('Plus');
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleWorkspace = () => {
    setIsWorkspaceOpen(!isWorkspaceOpen);
  };
  
  const addWorkspace = () => {
    const newWorkspace = {
      id: `workspace-${Date.now()}`,
      name: 'New Workspace',
      pages: []
    };
    
    setWorkspaces([...workspaces, newWorkspace]);
    setCurrentWorkspace(newWorkspace.name);
    toast.success('Created new workspace!');
  };
  
  const addPage = (workspaceId) => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: 'Untitled',
      icon: '📄'
    };
    
    setWorkspaces(workspaces.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          pages: [...workspace.pages, newPage]
        };
      }
      return workspace;
    }));
    
    setCurrentPage(newPage.id);
    toast.success('Created new page!');
  };
  
  const getCurrentPageName = () => {
    const workspace = workspaces.find(w => w.name === currentWorkspace);
    if (!workspace) return '';
    
    const page = workspace.pages.find(p => p.id === currentPage);
    return page ? page.name : '';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-surface-900">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-surface-800 rounded-md shadow-md"
      >
        <Menu size={20} />
      </button>
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed md:static top-0 left-0 z-50 h-full w-64 bg-surface-50 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-md md:shadow-none"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-primary">FlexNote</h1>
            <button
              onClick={() => toast.info('Settings would open here')}
              className="p-1.5 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700"
            >
              <Settings size={18} />
            </button>
          </div>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer" onClick={toggleWorkspace}>
              <div className="flex items-center">
                {isWorkspaceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-1 font-medium">{currentWorkspace}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addPage(workspaces.find(w => w.name === currentWorkspace)?.id);
                  }}
                  className="p-1 rounded-md hover:bg-surface-300 dark:hover:bg-surface-600"
                >
                  <FilePlus size={14} />
                </button>
              </div>
            </div>
            
            {isWorkspaceOpen && (
              <div className="ml-6 space-y-1">
                {workspaces.find(w => w.name === currentWorkspace)?.pages.map(page => (
                  <div
                    key={page.id}
                    className={`flex items-center p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer ${currentPage === page.id ? 'bg-surface-200 dark:bg-surface-700' : ''}`}
                    onClick={() => setCurrentPage(page.id)}
                  >
                    <span className="mr-2">{page.icon}</span>
                    <span>{page.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-2 p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer text-surface-500 dark:text-surface-400" onClick={addWorkspace}>
              <div className="flex items-center">
                <FolderPlus size={16} />
                <span className="ml-2">Add Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{getCurrentPageName()}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
              onClick={() => toast.info('This would share the document')}
            >
              Share
            </button>
          </div>
        </div>
        
        <MainFeature />
      </div>
    </div>
  );
}