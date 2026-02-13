import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationItems } from '../../utils/navigationItems';

export const useSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = navigationItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.parent && item.parent.toLowerCase().includes(query))
    );

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
    setHighlightedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSelect(searchResults[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleSelect = (item) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(item.path);
  };

  return {
    searchQuery, setSearchQuery,
    searchResults,
    showResults, setShowResults,
    highlightedIndex, setHighlightedIndex,
    searchRef,
    handleKeyDown,
    handleSelect
  };
};
