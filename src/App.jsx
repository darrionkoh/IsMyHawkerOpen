import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertTriangle, Loader2, Menu } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import LocateButton from './components/LocateButton';
import HawkerPopup from './components/HawkerPopup';
import SettingsDrawer from './components/SettingsDrawer';
import Header from './components/Header';
import { checkIsClosed } from './utils/dateHelper';
import { fetchHawkerData } from './services/api';
import './index.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [rawData, setRawData] = useState({ hawkers: null, closures: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("dark-mode") === "true");

  useEffect(() => {
    const root = window.document.documentElement;
    isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cachedData = sessionStorage.getItem("hawker_cache");
        if (cachedData) {
          setRawData(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
        const data = await fetchHawkerData();
        if (data) {
          setRawData(data);
          sessionStorage.setItem("hawker_cache", JSON.stringify(data));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("hawker-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("hawker-favorites", JSON.stringify(newFavs));
  };

  const allHawkers = useMemo(() => {
    if (!rawData.hawkers || !rawData.closures) return [];
    return rawData.hawkers
      .filter(f => f.geometry?.coordinates)
      .map(feature => {
        const name = feature.properties?.NAME || "";

        const closure = rawData.closures.find(c => {
          const cName = (c.name || "").toLowerCase();
          const fName = name.toLowerCase();
          return fName.includes(cName) || cName.includes(fName);
        });

        const { status, displayDate } = checkIsClosed(closure, today);

        return {
          id: feature.properties?.OBJECTID || Math.random(),
          name,
          position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
          address: feature.properties?.ADDRESS_STREET || "",
          status,
          isClosed: status === "closed",
          cleaningDates: displayDate,
          image: closure?.photourl || closure?.photo_url || null,
          description: closure?.description_myenv || closure?.remarks_other_works || "No description available.",
          marketStalls: closure?.no_of_market_stalls,
          foodStalls: closure?.no_of_food_stalls,
          googleMaps: closure?.google_3d_view
        };
      });
  }, [rawData, today]);

  const filteredHawkers = allHawkers.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "favorites") return matchesSearch && favorites.includes(h.id);
    if (filter === "open") return matchesSearch && h.status !== "closed";
    if (filter === "closed") return matchesSearch && h.status === "closed";
    return matchesSearch;
  });

  if (isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-violet-600">
      <Loader2 className="animate-spin mb-4" size={48} />
      <h1 className="text-xl font-black uppercase dark:text-violet-400">Syncing...</h1>
      <Analytics />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col h-[100dvh] w-screen font-sans overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      <Analytics />
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} filter={filter} setFilter={setFilter} today={today} />
      <main className="flex-1 relative overflow-hidden">
        <MapContainer center={[1.3521, 103.8198]} zoom={12} className="h-full w-full" zoomControl={false}>
          <TileLayer url={`https://www.onemap.gov.sg/maps/tiles/${isDarkMode ? 'Night' : 'Default'}/{z}/{x}/{y}.png`} attribution='OneMap' />
          <LocateButton isDarkMode={isDarkMode} />
          {filteredHawkers.map(hawker => (
            <Marker key={hawker.id} position={hawker.position} eventHandlers={{
              add: (e) => {
                if (hawker.status === "closed") e.target._icon.style.filter = "hue-rotate(150deg) brightness(0.8) saturate(2)";
                else if (hawker.status === "warning") e.target._icon.style.filter = "hue-rotate(165deg) brightness(1.9) saturate(2.0)";
              }
            }}>
              <Popup>
                <HawkerPopup hawker={hawker} isFavorite={favorites.includes(hawker.id)} onToggleFavorite={() => toggleFavorite(hawker.id)} isDarkMode={isDarkMode} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <button onClick={() => setIsSettingsOpen(true)} className={`absolute bottom-10 left-5 z-[1001] w-15 h-15 rounded-full shadow-2xl border flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700 text-violet-400' : 'bg-white border-slate-200 text-red-600'}`}>
          <Menu size={24} />
        </button>
        <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onClearFavorites={() => setFavorites([])} favoritesCount={favorites.length} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      </main>
      <footer className={`border-t p-2 text-[9px] text-center z-[1000] font-bold uppercase tracking-widest shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
        Showing {filteredHawkers.length} Live Hawker Centres
      </footer>
    </div>
  );
}

export default App;