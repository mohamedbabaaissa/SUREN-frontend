import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import "./ShoppingBag.css";

const SHIPPING_FLAT_RATE = 15;

function ShoppingBag() {
  const { bagItems, removeFromBag, updateBagQty, bagSubtotal } = useStore();

  const safeUpdate = async (key, qty) => {
    try { await updateBagQty(key, qty); } catch (error) { alert(error.message || "Could not update the bag."); }
  };

  const safeRemove = async (key) => {
    try { await removeFromBag(key); } catch (error) { alert(error.message || "Could not remove the item."); }
  };
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shipping = bagItems.length === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = bagSubtotal + shipping;

  return (
    <div className="bag-page">
      <div className="page-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Your Bag</span>
      </div>

      <h1 className="bag-title">Your Bag</h1>

      {bagItems.length === 0 ? (
        <div className="bag-empty">
          <p>Your bag is currently empty.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bag-layout">
          {/* ITEMS */}
          <div className="bag-items">
            {bagItems.map((item) => (
              <div className="bag-item" key={item.key}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="bag-item-img"
                />

                <div className="bag-item-info">
                  <h3>{item.title}</h3>
                  <p className="bag-item-meta">
                    {item.size ? `Size: ${item.size}` : null}
                    {item.color ? ` · Color: ${item.color}` : null}
                  </p>
                  <p className="bag-item-price">${item.price.toFixed(2)}</p>

                  <div className="bag-item-controls">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() => safeUpdate(item.key, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => safeUpdate(item.key, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="bag-remove-btn"
                      onClick={() => safeRemove(item.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${bagSubtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <Link to="/" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ShoppingBag;
