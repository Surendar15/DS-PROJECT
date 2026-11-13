import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const handleClear = () => {
    setSearchQuery("");
  };

  const handleSubmit = () => {
    if (onSearchSubmit && searchQuery && searchQuery.trim().length > 0) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <button
          className="search-icon-btn cursor-pointer bg-transparent border-0 p-0 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors"
          onClick={handleSubmit}
          title="Click or press Enter to search"
          type="button"
        >
          <Search size={20} className="search-icon" />
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={handleClear} type="button">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
