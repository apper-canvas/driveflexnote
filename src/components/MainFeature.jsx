import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem('flexnote-blocks');
    return saved ? JSON.parse(saved) : [
      { id: 'welcome', type: 'heading', content: 'Welcome to FlexNote', level: 1 },
      { id: 'intro', type: 'paragraph', content: 'This is your flexible workspace. Start typing or use the "+" button to add blocks.' },
    ];
  });
  
  const [editingId, setEditingId] = useState(null);
  const [newBlockType, setNewBlockType] = useState('paragraph');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  
  const editRef = useRef(null);
  const menuRef = useRef(null);
  const commandMenuRef = useRef(null);
  
  const Plus = getIcon('Plus');
  const Trash2 = getIcon('Trash2');
  const Pencil = getIcon('Pencil');
  const Check = getIcon('Check');
  const Image = getIcon('Image');
  const ListOrdered = getIcon('ListOrdered');
  const ListTodo = getIcon('ListChecks');
  const Code = getIcon('Code');
  const Type = getIcon('Type');
  const Heading1 = getIcon('Heading1');
  const Heading2 = getIcon('Heading2');
  const CommandIcon = getIcon('Command');
  const X = getIcon('X');

  useEffect(() => {
    localStorage.setItem('flexnote-blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
    }
  }, [editingId]);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (commandMenuRef.current && !commandMenuRef.current.contains(event.target)) {
        setIsCommandMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === '/' && !isCommandMenuOpen) {
      e.preventDefault();
      setIsCommandMenuOpen(true);
    } else if (e.key === 'Escape') {
      setIsCommandMenuOpen(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      level: type === 'heading' ? 1 : undefined,
    };
    
    setBlocks([...blocks, newBlock]);
    setEditingId(newBlock.id);
    setIsMenuOpen(false);
    
    toast.success(`Added new ${type} block`);
  };
  
  const updateBlock = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };
  
  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setEditingId(null);
    toast.info("Block deleted");
  };
  
  const handleCommandExecution = () => {
    const command = commandInput.toLowerCase().trim();
    
    if (command.startsWith('h1 ')) {
      addBlock('heading');
      updateBlock(blocks[blocks.length - 1].id, command.substring(3));
    } else if (command.startsWith('h2 ')) {
      const newBlock = {
        id: Date.now().toString(),
        type: 'heading',
        content: command.substring(3),
        level: 2,
      };
      setBlocks([...blocks, newBlock]);
    } else if (command.startsWith('todo ')) {
      const newBlock = {
        id: Date.now().toString(),
        type: 'todo',
        content: command.substring(5),
        checked: false,
      };
      setBlocks([...blocks, newBlock]);
    } else if (command.startsWith('code ')) {
      addBlock('code');
      updateBlock(blocks[blocks.length - 1].id, command.substring(5));
    } else {
      addBlock('paragraph');
      updateBlock(blocks[blocks.length - 1].id, commandInput);
    }
    
    setCommandInput('');
    setIsCommandMenuOpen(false);
  };

  const toggleTodo = (id) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, checked: !block.checked } : block
    ));
  };

  const renderBlock = (block) => {
    if (editingId === block.id) {
      return (
        <div className="flex items-start gap-2 group relative">
          <textarea
            ref={editRef}
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onBlur={() => setEditingId(null)}
            className="w-full min-h-[100px] resize-y p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <button
            onClick={() => setEditingId(null)}
            className="p-2 rounded-full bg-primary text-white"
          >
            <Check size={16} />
          </button>
        </div>
      );
    }
    
    switch (block.type) {
      case 'heading':
        return (
          <div className="group relative flex items-start">
            {block.level === 1 ? (
              <h1 className="w-full py-2 px-3">{block.content}</h1>
            ) : (
              <h2 className="w-full py-2 px-3">{block.content}</h2>
            )}
            {renderBlockControls(block)}
          </div>
        );
      case 'todo':
        return (
          <div className="group relative flex items-start gap-2">
            <input 
              type="checkbox" 
              checked={block.checked}
              onChange={() => toggleTodo(block.id)}
              className="mt-1.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <p className={`w-full py-2 ${block.checked ? 'line-through text-surface-400' : ''}`}>
              {block.content}
            </p>
            {renderBlockControls(block)}
          </div>
        );
      case 'code':
        return (
          <div className="group relative">
            <pre className="w-full p-3 bg-surface-100 dark:bg-surface-800 rounded-lg font-mono text-sm overflow-x-auto">
              <code>{block.content}</code>
            </pre>
            {renderBlockControls(block)}
          </div>
        );
      case 'image':
        return (
          <div className="group relative">
            <img 
              src={block.content} 
              alt="User uploaded content" 
              className="w-full rounded-lg object-cover max-h-[400px]"
            />
            {renderBlockControls(block)}
          </div>
        );
      case 'paragraph':
      default:
        return (
          <div className="group relative">
            <p className="w-full py-2 px-3">{block.content}</p>
            {renderBlockControls(block)}
          </div>
        );
    }
  };
  
  const renderBlockControls = (block) => (
    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-1 hidden group-hover:flex">
      <button
        onClick={() => setEditingId(block.id)}
        className="p-1.5 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={() => deleteBlock(block.id)}
        className="p-1.5 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative">
      <div 
        className="fixed bottom-20 right-4 sm:bottom-20 sm:right-6 z-40" 
        ref={menuRef}
      >
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-14 right-0 bg-white dark:bg-surface-800 shadow-lg rounded-lg p-3 w-[220px] flex flex-col gap-2 border border-surface-200 dark:border-surface-700"
          >
            <button 
              onClick={() => addBlock('paragraph')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left"
            >
              <Type size={18} />
              <span>Text</span>
            </button>
            <button 
              onClick={() => addBlock('heading')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left"
            >
              <Heading1 size={18} />
              <span>Heading</span>
            </button>
            <button 
              onClick={() => addBlock('todo')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left"
            >
              <ListTodo size={18} />
              <span>To-do List</span>
            </button>
            <button 
              onClick={() => addBlock('code')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left"
            >
              <Code size={18} />
              <span>Code</span>
            </button>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full bg-primary shadow-lg text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
        >
          {isMenuOpen ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {isCommandMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
          onClick={() => setIsCommandMenuOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            ref={commandMenuRef}
            className="w-full max-w-xl bg-white dark:bg-surface-800 rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CommandIcon size={20} className="text-primary" />
              <h3 className="text-lg font-semibold">Command Menu</h3>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommandExecution();
                  if (e.key === 'Escape') setIsCommandMenuOpen(false);
                }}
                placeholder="Type a command (h1, h2, todo, code) or just text..."
                className="w-full p-3 rounded-lg bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                autoFocus
              />
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  setCommandInput('h1 ');
                  document.querySelector('input').focus();
                }}
                className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-md text-sm hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Heading 1
              </button>
              <button 
                onClick={() => {
                  setCommandInput('h2 ');
                  document.querySelector('input').focus();
                }}
                className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-md text-sm hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Heading 2
              </button>
              <button 
                onClick={() => {
                  setCommandInput('todo ');
                  document.querySelector('input').focus();
                }}
                className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-md text-sm hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                To-do
              </button>
              <button 
                onClick={() => {
                  setCommandInput('code ');
                  document.querySelector('input').focus();
                }}
                className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-md text-sm hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Code
              </button>
            </div>
            
            <div className="mt-3 text-xs text-surface-500">
              Press <kbd className="px-1 py-0.5 bg-surface-200 dark:bg-surface-700 rounded">Enter</kbd> to execute, <kbd className="px-1 py-0.5 bg-surface-200 dark:bg-surface-700 rounded">Esc</kbd> to close
            </div>
          </motion.div>
        </div>
      )}

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onKeyDown={handleKeyDown}
      >
        {blocks.map(block => (
          <div 
            key={block.id}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {renderBlock(block)}
          </div>
        ))}
      </motion.div>
      
      <div className="fixed bottom-4 left-4 z-40 text-sm text-surface-500 dark:text-surface-400 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm py-1 px-2 rounded-lg shadow-sm">
        Press <kbd className="px-1 py-0.5 bg-surface-200 dark:bg-surface-700 rounded">/</kbd> for commands
      </div>
    </div>
  );
}