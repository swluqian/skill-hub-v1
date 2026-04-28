import React from 'react';
import { Category } from '../../types';
import './styles.css';

interface CategoryFilterProps {
  categories: Category[];
  activeId: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryFilter({ categories, activeId, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <button
        className={`category-tag ${activeId === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-tag ${activeId === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
