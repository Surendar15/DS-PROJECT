import React from "react";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-wrapper" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        <button className="quick-view-overlay" title="Quick View">
          <Eye size={18} /> View Details
        </button>
      </div>

      <div className="product-card-body">
        <h3 className="product-title" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>

        <div className="product-meta">
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
            <span className="rating-value">{product.rating}</span>
          </div>
          <span className="product-price">₹{product.price.toFixed(2)}</span>
        </div>

        <div className="product-actions">
          <button
            className="btn btn-secondary text-sm"
            onClick={() => onViewDetails(product)}
          >
            Details
          </button>
          <button
            className="btn btn-primary text-sm flex items-center gap-1"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
