import React from 'react';
import { Soup, Search, Heart } from 'lucide-react';

const Header = ({ searchTerm, setSearchTerm, filter, setFilter, today }) => {
  return (
    <header className="sticky top-0 p-4 bg-red-600 text-white shadow-lg z-[1000] flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Soup size={30} />
          <h1 className="text-[24px] font-black italic tracking-tighter">IsMyHawkerOpen</h1>
        </div>
        <div className="text-[10px] font-mono bg-red-800 px-2 py-1 rounded shadow-inner uppercase font-bold">
          {today.toDateString()}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-red-300" size={18} />
        <input
          type="text"
          placeholder="Search hawker centre..."
          className="w-full bg-red-700 text-white placeholder-red-300 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white/50 border-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Row with Favorites Added */}
      <div className="flex gap-1.5 text-[9px] font-black">
        {["all", "open", "closed", "favorites"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`flex-1 py-2 rounded uppercase transition-all shadow-sm flex items-center justify-center gap-1 ${filter === type ? 'bg-white text-red-600' : 'bg-red-700 text-red-100 hover:bg-red-800'
              }`}
          >
            {type === "favorites" ? (
              <>
                <Heart size={10} fill={filter === "favorites" ? "currentColor" : "none"} />
                <span>Favs</span>
              </>
            ) : (
              type
            )}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;