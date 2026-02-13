import React, { useContext } from "react";
import { Search } from "lucide-react";
import { ThemeContext } from "../common/ThemeContext";
import { useSearchBar } from "../../hooks/common/useSearchBar";

const SearchBar = () => {
  const { theme } = useContext(ThemeContext);
  const {
    searchQuery, setSearchQuery,
    searchResults,
    showResults, setShowResults,
    highlightedIndex, setHighlightedIndex,
    searchRef,
    handleKeyDown,
    handleSelect
  } = useSearchBar();

  return (
    <div className="relative grow max-w-2xl" ref={searchRef}>
      <div className="flex items-center px-3 py-2 rounded-lg bg-transparent border-0 group transition-all">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-orange" />
        <input
          type="text"
          className="w-full ml-3 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-sm"
          placeholder="Search... "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={(e) => {
            e.stopPropagation();
            searchQuery && setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showResults && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden z-[100]
          ${theme === 'dark' 
            ? 'bg-[#2F3349] border-white/5 shadow-black/40' 
            : 'bg-white border-gray-100 shadow-gray-200'
          }`}
        >
          {searchResults.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-3 cursor-pointer transition-colors flex flex-col ${
                index === highlightedIndex ? "bg-primary-orange/10 text-primary-orange" : "text-gray-300 hover:bg-white/5"
              }`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span className="text-sm font-medium">{item.name}</span>
              {item.parent && (
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.parent}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
