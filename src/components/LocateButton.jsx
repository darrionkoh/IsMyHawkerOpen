import React from 'react';
import { useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';

const LocateButton = () => {
  const map = useMap();

  const handleLocate = () => {
    map.locate().on("locationfound", (e) => {
      map.flyTo(e.latlng, 16, {
        animate: true,
        duration: 1.0
      });
    }).on("locationerror", () => {
      alert("Unable to access your location. Please enable location services in your browser.");
    });
  };

  return (
    <button 
      onClick={handleLocate}
      className="absolute bottom-10 right-5 z-[1000] bg-white w-15 h-15 rounded-full shadow-2xl border border-slate-200 text-red-600 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center"
      title="Locate Me"
    >
      <MapPin size={24} />
    </button>
  );
};

export default LocateButton;