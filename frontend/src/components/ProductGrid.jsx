import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onViewDetails }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-grid-state">
        <p className="empty-text">No products found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
