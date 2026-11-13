import React, { useState } from "react";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart({ isOpen, onClose, onCheckoutSuccess }) {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [isSimulatingCheckout, setIsSimulatingCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCheckout = () => {
    setIsSimulatingCheckout(true);
    setTimeout(() => {
      setIsSimulatingCheckout(false);
      setCheckoutComplete(true);
      if (onCheckoutSuccess) onCheckoutSuccess();
    }, 1500);
  };

  const handleClose = () => {
    setCheckoutComplete(false);
    onClose();
  };

  return (
    <div className="cart-modal-overlay" onClick={handleClose}>
      <div className="cart-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <div className="cart-header-title">
            <ShoppingBag size={22} className="text-primary" />
            <h2>Your Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
          </div>
          <button className="cart-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-modal-body">
          {checkoutComplete ? (
            <div className="checkout-success-view">
              <div className="success-icon-badge">✓</div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your purchase simulation. Your session intent has been recorded.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  clearCart();
                  setCheckoutComplete(false);
                  onClose();
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <p>Your shopping cart is currently empty.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
                  </div>

                  <div className="cart-item-qty-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>

                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {!checkoutComplete && cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span className="summary-amount">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row shipping-note">
              <span>Estimated Shipping:</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="cart-summary-row total-row">
              <span>Total:</span>
              <span className="total-amount">₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={handleSimulateCheckout}
              disabled={isSimulatingCheckout}
            >
              {isSimulatingCheckout ? (
                "Processing Simulation..."
              ) : (
                <>
                  Proceed to Checkout <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
