import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Info, Calendar, Map as MapIcon, Heart } from 'lucide-react';

const HawkerPopup = ({ hawker, isFavorite, onToggleFavorite, isDarkMode }) => {
  const [tab, setTab] = useState('status');

  // Dynamic Styles based on Dark Mode
  const bgClass = isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800';
  const secondaryBgClass = isDarkMode ? 'bg-slate-800' : 'bg-slate-100';
  const borderClass = isDarkMode ? 'border-slate-800' : 'border-slate-100';
  const textMutedClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`p-0 min-w-[240px] max-w-[240px] overflow-hidden rounded-md font-sans transition-colors duration-300 ${bgClass}`}>
      {hawker.image && (
        <img src={hawker.image} alt={hawker.name} className="w-full h-24 object-cover" />
      )}

      {/* Sliding Tab Container */}
      <div className={`relative flex p-1 m-2 rounded-lg ${secondaryBgClass}`}>
        <div 
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md shadow-sm transition-transform duration-300 ease-in-out
            ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}
          style={{
            transform: tab === 'status' ? 'translateX(0)' : 'translateX(100%)'
          }}
        />

        <button 
          onClick={() => setTab('status')}
          className={`relative z-10 flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-colors duration-300
            ${tab === 'status' ? 'text-red-500' : textMutedClass}`}
        >
          <Calendar size={12} /> STATUS
        </button>
        
        <button 
          onClick={() => setTab('info')}
          className={`relative z-10 flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-colors duration-300
            ${tab === 'info' ? 'text-red-500' : textMutedClass}`}
        >
          <Info size={12} /> ABOUT
        </button>
      </div>

      <div className="p-3 pt-1 min-h-[120px]">
        {tab === 'status' ? (
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className={`font-bold text-sm uppercase leading-tight flex-1
                ${hawker.status === 'closed' ? 'text-red-500' : 
                  hawker.status === 'warning' ? 'text-amber-500' : (isDarkMode ? 'text-white' : 'text-slate-800')}`}>
                {hawker.name}
              </h2>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="transition-transform active:scale-125 hover:scale-110"
              >
                <Heart 
                  size={18} 
                  className={`transition-colors duration-300 ${isFavorite ? "fill-red-500 text-red-500" : (isDarkMode ? "text-slate-600" : "text-slate-300")}`} 
                />
              </button>
            </div>
            
            <div className={`mt-2 py-1 px-2 rounded text-[9px] font-black flex items-center gap-1 w-fit
              ${hawker.status === 'closed' ? 'bg-red-500/20 text-red-400' : 
                hawker.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 
                'bg-green-500/20 text-green-400'}`}>
              {hawker.status === 'closed' && <AlertTriangle size={10}/>}
              {hawker.status === 'warning' && <Clock size={10}/>}
              {hawker.status === 'open' && <CheckCircle size={10}/>}
              {hawker.status.toUpperCase()}
            </div>

            <p className={`text-[10px] mt-2 font-medium italic border-t pt-2 ${textMutedClass} ${borderClass}`}>
              {hawker.cleaningDates}
            </p>
          </div>
        ) : (
          <div>
            <p className={`text-[12px] leading-relaxed mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {hawker.description || "No description available."}
            </p>
            
            <div className={`grid grid-cols-2 gap-2 border-t pt-2 ${borderClass}`}>
              <div className={`text-center p-1 rounded ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <p className={`text-[8px] uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Food Stalls</p>
                <p className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{hawker.foodStalls || 0}</p>
              </div>
              <div className={`text-center p-1 rounded ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <p className={`text-[8px] uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Market Stalls</p>
                <p className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{hawker.marketStalls || 0}</p>
              </div>
            </div>

            {hawker.googleMaps && (
              <a 
                href={hawker.googleMaps} 
                target="_blank" 
                rel="noreferrer"
                className={`mt-3 block text-center text-[10px] font-bold flex items-center justify-center gap-1 hover:underline
                  ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
              >
                <MapIcon size={10} /> View 3D Street View
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HawkerPopup;