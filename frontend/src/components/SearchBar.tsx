import React from 'react';
import { SearchIcon } from '@icons';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export const SearchBar = ({ onSearch, searchTerm }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search By Title, Category, or Description"
        className="search-bar-input"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      <SearchIcon />
    </div>
  );
};
