import React from 'react';
import { X, Settings, Trash2, Moon, Sun } from 'lucide-react';

const SettingsDrawer = ({ 
  isOpen, 
  onClose, 
  onClearFavorites, 
  favoritesCount,
  isDarkMode,
  onToggleDarkMode 
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[2000] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 bottom-0 left-0 w-[280px] z-[2001] shadow-2xl p-6 flex flex-col gap-6
          transition-transform duration-300 ease-out font-sans
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
      >
        <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <Settings size={22} className="text-red-600" />
            <h2 className="text-xl font-black uppercase tracking-tight">Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Appearance</h3>
          <button 
            onClick={onToggleDarkMode}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-700'}`}
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
              <span className="text-sm font-bold">Dark Mode</span>
            </div>
            
            {/* Toggle Switch UI */}
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-red-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-6' : 'left-1'}`} />
            </div>
          </button>
        </div>

        {/* Favorites Management Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data Management</h3>
          <button 
            onClick={onClearFavorites}
            disabled={favoritesCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-100 text-red-700 rounded-xl text-sm font-black
              transition-colors hover:bg-red-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Trash2 size={16} />
            Clear All Favorites
          </button>
        </div>

        <div className={`mt-auto text-center text-xs text-slate-400 border-t pt-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <p className="font-bold">IsMyHawkerOpen</p>
          <p>v1.0.2 • Built by Darrion Koh</p>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;