import React from "react";
import { CATEGORIES } from "../data/products";

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter-container">
      <div className="category-pills">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              className={`category-pill ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
