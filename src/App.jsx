import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertTriangle, CheckCircle, Clock, Menu } from 'lucide-react';
import LocateButton from './components/LocateButton';
import HawkerPopup from './components/HawkerPopup';
import SettingsDrawer from './components/SettingsDrawer';
import Header from './components/Header';
import { checkIsClosed } from './utils/dateHelper';
import HAWKER_DATA_RAW from './data/hawkers_full.json';
import CLOSURE_DATA from './data/closures.json';
import './index.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const today = new Date();

  // --- DARK MODE LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("dark-mode") === "true";
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("dark-mode", newMode);
  };

  // Favorites logic
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("hawker-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("hawker-favorites", JSON.stringify(newFavorites));
  };

  const clearFavorites = () => {
    if (favorites.length === 0) return;
    if (window.confirm(`Clear all ${favorites.length} favorite hawkers?`)) {
      setFavorites([]);
      localStorage.removeItem("hawker-favorites");
      setIsSettingsOpen(false);
    }
  };

  const allHawkers = useMemo(() => {
    return HAWKER_DATA_RAW?.features
      ?.filter(f => f.geometry && f.geometry.coordinates)
      .map(feature => {
        const name = feature.properties?.NAME || "Unknown Hawker";
        const closure = Array.isArray(CLOSURE_DATA) ? CLOSURE_DATA.find(c => {
          const cName = c.name || "";
          return name.toLowerCase().includes(cName.toLowerCase()) || 
                 cName.toLowerCase().includes(name.toLowerCase());
        }) : null;

        const { status, displayDate } = checkIsClosed(closure, today);

        return {
          id: feature.properties?.OBJECTID || Math.random(),
          name,
          position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
          address: feature.properties?.ADDRESS_STREET || "",
          status,
          isClosed: status === "closed", 
          cleaningDates: displayDate,
          image: closure?.photourl,
          description: closure?.description_myenv,
          marketStalls: closure?.no_of_market_stalls,
          foodStalls: closure?.no_of_food_stalls,
          googleMaps: closure?.google_3d_view
        };
      }) || [];
  }, [today]);

  const filteredHawkers = allHawkers.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "favorites") return matchesSearch && favorites.includes(h.id);
    if (filter === "open") return matchesSearch && h.status !== "closed";
    if (filter === "closed") return matchesSearch && h.status === "closed";
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 font-sans overflow-hidden">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filter={filter} 
        setFilter={setFilter} 
        today={today}
      />

      <main className="flex-1 relative">
        <MapContainer 
          center={[1.3521, 103.8198]} 
          zoom={12} 
          className="h-full w-full"
          zoomControl={false}
        >
          {/* DYNAMIC TILE LAYER */}
          <TileLayer
            url={`https://www.onemap.gov.sg/maps/tiles/${isDarkMode ? 'Night' : 'Default'}/{z}/{x}/{y}.png`}
            attribution='OneMap'
          />

          <LocateButton isDarkMode={isDarkMode} />
          
          {filteredHawkers.map(hawker => (
            <Marker 
              key={hawker.id} 
              position={hawker.position}
              interactive={!isSettingsOpen}
              eventHandlers={{
                add: (e) => {
                  if (hawker.status === "closed") {
                    e.target._icon.style.filter = "hue-rotate(150deg) brightness(0.8) saturate(2)";
                  } else if (hawker.status === "warning") {
                    e.target._icon.style.filter = "hue-rotate(165deg) brightness(1.9) saturate(2.0)";
                  } else {
                    e.target._icon.style.filter = "none";
                  }
                }
              }}
            >
              <Popup>
                <HawkerPopup 
                  hawker={hawker} 
                  isFavorite={favorites.includes(hawker.id)}
                  onToggleFavorite={() => toggleFavorite(hawker.id)}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <button 
        onClick={() => setIsSettingsOpen(true)}
        className={`absolute bottom-10 left-5 z-[1001] w-15 h-15 rounded-full shadow-2xl border transition-all active:scale-90 flex items-center justify-center
          ${isDarkMode 
            ? 'bg-slate-800 border-slate-700 text-red-500 hover:bg-slate-700' 
            : 'bg-white border-slate-200 text-red-600 hover:bg-slate-50'}`}
        title="Open Settings"
        >
         <Menu size={24} />
        </button>

        <SettingsDrawer 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onClearFavorites={clearFavorites}
          favoritesCount={favorites.length}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </main>

      <footer className="bg-white border-t p-2 text-[9px] text-slate-400 text-center z-[1000] font-bold uppercase tracking-widest shadow-2xl">
        Showing {filteredHawkers.length} Hawker Centres
      </footer>
    </div>
  );
}

export default App;