import React, { useState } from "react";
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductDetails({ product, onBack }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="product-details-container">
      <button className="btn btn-outline back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Products
      </button>

      {addedToast && (
        <div className="toast-notification">
          <span>Added {quantity} x {product.name} to cart!</span>
        </div>
      )}

      <div className="product-details-card">
        <div className="product-details-image-section">
          <img src={product.image} alt={product.name} className="product-details-image" />
        </div>

        <div className="product-details-info">
          <span className="details-category-badge">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          <div className="details-rating">
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <span className="details-rating-num">{product.rating} / 5.0</span>
            <span className="details-reviews-count">(124 customer reviews)</span>
          </div>

          <div className="details-price">₹{product.price.toFixed(2)}</div>

          <p className="details-description">{product.description}</p>

          <div className="quantity-selector-wrapper">
            <label className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <button className="btn btn-primary add-to-cart-large-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} /> Add to Cart (₹{(product.price * quantity).toFixed(2)})
          </button>

          <div className="product-value-props">
            <div className="value-prop">
              <Truck size={18} className="text-primary" />
              <span>Free Express Shipping on Orders &gt; ₹500</span>
            </div>
            <div className="value-prop">
              <ShieldCheck size={18} className="text-primary" />
              <span>2-Year Authentic Warranty Guarantee</span>
            </div>
            <div className="value-prop">
              <RefreshCw size={18} className="text-primary" />
              <span>Hassle-Free 30-Day Money-Back Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
