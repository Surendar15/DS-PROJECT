import React, { useState, useEffect } from "react";
import { PRODUCTS } from "./data/products";
import { CartProvider, useCart } from "./context/CartContext";
import { SessionProvider, useSession } from "./context/SessionContext";

import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import SessionIndicator from "./components/SessionIndicator";
import ProductDetails from "./components/ProductDetails";

import Home from "./pages/Home";
import Products from "./pages/Products";
import AboutPage from "./pages/AboutPage";
import ResearchDashboard from "./pages/ResearchDashboard";

function MainApp() {
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { recordPageView, recordSearch, recordCategoryFilter, recordCartAction } = useSession();
  const { cartCount, cartItems } = useCart();

  // Track route changes for session analytics
  const handleNavigate = (page) => {
    setActivePage(page);
    if (page === "home") recordPageView("/");
    else if (page === "products") recordPageView("/products");
    else if (page === "about") recordPageView("/about");
    else if (page === "research") recordPageView("/research");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setActivePage("product_details");
    recordPageView(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    recordCategoryFilter();
  };

  const handleSearchSubmit = (query) => {
    if (query && query.trim().length > 0) recordSearch();
  };

  // Filter products by category & search query
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        cartCount={cartCount}
        onOpenCart={() => {
          setIsCartOpen(true);
          recordPageView("/cart");
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === "home" && (
          <Home
            products={filteredProducts}
            onViewProductDetails={handleViewProductDetails}
            onNavigateProducts={() => handleNavigate("products")}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
        )}

        {activePage === "products" && (
          <Products
            products={filteredProducts}
            onViewProductDetails={handleViewProductDetails}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
        )}

        {activePage === "product_details" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => handleNavigate("products")}
          />
        )}

        {activePage === "about" && <AboutPage />}
        {activePage === "research" && <ResearchDashboard />}
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="footer-container">
          <p className="footer-copyright">
            © 2026 AuraCommerce Research Project — Machine Learning Powered E-Commerce
          </p>
          <div className="footer-links">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="footer-api-pill"
              title="Click to view FastAPI Swagger Docs"
            >
              <span className="footer-api-dot" />
              <span>FastAPI Backend: http://localhost:8000</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Slide-over Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutSuccess={() => {
          recordPageView("/checkout");
        }}
      />

      {/* Subtle Live Session Indicator */}
      <SessionIndicator />
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </SessionProvider>
  );
}
