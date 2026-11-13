import React from "react";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Award } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";
import PredictionPanel from "../components/PredictionPanel";

export default function Home({
  products,
  onViewProductDetails,
  onNavigateProducts,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="page-container home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">New Season Collection 2026</span>
          <h1 className="hero-title">Discover Products You&apos;ll Love</h1>
          <p className="hero-description">
            Explore our curated catalog of electronics, fashion, home essentials, and lifestyle accessories designed for modern living.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={onNavigateProducts}>
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ML Prediction Demo Panel */}
      <section className="mb-8">
        <PredictionPanel />
      </section>

      {/* Category Explorer */}
      <section className="category-section mb-8">
        <div className="section-header">
          <h2>Browse By Category</h2>
          <p>Filter products by popular categories</p>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </section>

      {/* Featured Products Grid */}
      <section className="featured-products-section">
        <div className="section-header flex-between">
          <div>
            <h2>Featured Products</h2>
            <p>Popular choices selected by customers</p>
          </div>
          <button className="btn btn-outline" onClick={onNavigateProducts}>
            View All ({products.length})
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={onSearchSubmit}
          />
        </div>

        <ProductGrid
          products={featuredProducts}
          onViewDetails={onViewProductDetails}
        />
      </section>

      {/* Trust Badges */}
      <section className="trust-badges-section mt-12">
        <div className="badge-item">
          <Zap size={24} className="text-primary" />
          <h4>Instant Machine Learning Intent Analysis</h4>
          <p>Real-time Random Forest predictions</p>
        </div>
        <div className="badge-item">
          <ShieldCheck size={24} className="text-primary" />
          <h4>Secure Shopping Experience</h4>
          <p>Encrypted simulated transactions</p>
        </div>
        <div className="badge-item">
          <Award size={24} className="text-primary" />
          <h4>Curated Premium Quality</h4>
          <p>Top-rated catalog items</p>
        </div>
      </section>
    </div>
  );
}
