import React, { useState } from 'react';
import './styles.css';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({ onSearch, placeholder = '搜索 Skills...', defaultValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="search-btn">搜索</button>
    </form>
  );
}
