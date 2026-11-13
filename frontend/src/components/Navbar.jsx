import React from "react";
import { ShoppingBag, Search, Home, Package, Info, ShoppingCart, BarChart2 } from "lucide-react";

export default function Navbar({ activePage, setActivePage, cartCount, onOpenCart }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActivePage("home")}>
          <div className="brand-icon">
            <ShoppingBag size={24} className="text-primary" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AuraCommerce</span>
            <span className="brand-subtitle">Smart Shopping Analytics</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="navbar-links">
          <button
            className={`nav-link ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            className={`nav-link ${activePage === "products" ? "active" : ""}`}
            onClick={() => setActivePage("products")}
          >
            <Package size={18} />
            <span>Products</span>
          </button>

          <button
            className={`nav-link ${activePage === "about" ? "active" : ""}`}
            onClick={() => setActivePage("about")}
          >
            <Info size={18} />
            <span>About Project</span>
          </button>

          <button
            className={`nav-link ${activePage === "research" ? "active" : ""}`}
            onClick={() => setActivePage("research")}
          >
            <BarChart2 size={18} />
            <span>Research</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="cart-button" onClick={onOpenCart} aria-label="Open Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
