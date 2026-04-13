import React from 'react';
import { X, Settings, Trash2, Heart } from 'lucide-react';

const SettingsDrawer = ({ isOpen, onClose, onClearFavorites, favoritesCount }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[2000] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0  pointer-events-none'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 bottom-0 left-0 w-[280px] bg-white z-[2001] shadow-2xl p-6 flex flex-col gap-6
          transition-transform duration-300 ease-out font-sans
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings size={22} className="text-red-600" />
            <h2 className="text-xl font-black uppercase tracking-tight">Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Favorites Management Section */}
        <div className="space-y-4">

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

        <div className="mt-auto text-center text-xs text-slate-400 border-t pt-4">
          <p className="font-bold">IsMyHawkerOpen</p>
          <p>v1.0.2 • Built by Darrion Koh</p>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;