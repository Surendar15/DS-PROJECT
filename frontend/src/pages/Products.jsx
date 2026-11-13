import React from "react";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

export default function Products({
  products,
  onViewProductDetails,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) {
  return (
    <div className="page-container products-page">
      <div className="page-header">
        <h1>Product Catalog</h1>
        <p>Explore all available items ({products.length} products found)</p>
      </div>

      <div className="catalog-toolbar">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={onSearchSubmit}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      <ProductGrid products={products} onViewDetails={onViewProductDetails} />
    </div>
  );
}
