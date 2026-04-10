import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Info, Calendar, Map as MapIcon } from 'lucide-react';

const HawkerPopup = ({ hawker }) => {
  const [tab, setTab] = useState('status');

  return (
    <div className="p-0 min-w-[240px] max-w-[240px] overflow-hidden rounded-md font-sans text-slate-800">
      {hawker.image && (
        <img src={hawker.image} alt={hawker.name} className="w-full h-24 object-cover" />
      )}

      <div className="relative flex bg-slate-100 p-1 m-2 rounded-lg">
        <div 
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-in-out"
          style={{
            transform: tab === 'status' ? 'translateX(0)' : 'translateX(100%)'
          }}
        />

        <button 
          onClick={() => setTab('status')}
          className={`relative z-10 flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-colors duration-300
            ${tab === 'status' ? 'text-red-600' : 'text-slate-500'}`}
        >
          <Calendar size={12} /> STATUS
        </button>
        
        <button 
          onClick={() => setTab('info')}
          className={`relative z-10 flex-1 py-1.5 text-[10px] font-black flex items-center justify-center gap-1 transition-colors duration-300
            ${tab === 'info' ? 'text-red-600' : 'text-slate-500'}`}
        >
          <Info size={12} /> ABOUT
        </button>
      </div>

      <div className="p-3 pt-1 min-h-[120px]">
        {tab === 'status' ? (
          <div>
            <h2 className={`font-bold text-sm uppercase leading-tight 
              ${hawker.status === 'closed' ? 'text-red-600' : 
                hawker.status === 'warning' ? 'text-amber-600' : 'text-slate-800'}`}>
              {hawker.name}
            </h2>
            
            <div className={`mt-2 py-1 px-2 rounded text-[9px] font-black flex items-center gap-1 w-fit
              ${hawker.status === 'closed' ? 'bg-red-100 text-red-700' : 
                hawker.status === 'warning' ? 'bg-amber-100 text-amber-700' : 
                'bg-green-100 text-green-700'}`}>
              {hawker.status === 'closed' && <AlertTriangle size={10}/>}
              {hawker.status === 'warning' && <Clock size={10}/>}
              {hawker.status === 'open' && <CheckCircle size={10}/>}
              {hawker.status.toUpperCase()}
            </div>

            <p className="text-[10px] text-slate-500 mt-2 font-medium italic border-t pt-2 border-slate-100">
              {hawker.cleaningDates}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[12px] leading-relaxed text-slate-600 mb-3">
              {hawker.description || "No description available."}
            </p>
            
            <div className="grid grid-cols-2 gap-2 border-t pt-2 border-slate-100">
              <div className="text-center bg-slate-50 p-1 rounded">
                <p className="text-[8px] uppercase text-slate-400 font-bold">Food Stalls</p>
                <p className="text-xs font-black text-slate-700">{hawker.foodStalls || 0}</p>
              </div>
              <div className="text-center bg-slate-50 p-1 rounded">
                <p className="text-[8px] uppercase text-slate-400 font-bold">Market Stalls</p>
                <p className="text-xs font-black text-slate-700">{hawker.marketStalls || 0}</p>
              </div>
            </div>

            {hawker.googleMaps && (
              <a 
                href={hawker.googleMaps} 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 block text-center text-[10px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1"
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