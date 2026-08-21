import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { apiFetch } from "../../lib/api";
import "./Checkout.css";

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Shipping (3-5 days)", price: 15 },
  { id: "express", label: "Express Shipping (1-2 days)", price: 35 },
];

function Checkout() {
  const { bagItems, bagSubtotal, clearBag, user } = useStore();
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    notes: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect back to the bag if there's nothing to check out
  useEffect(() => {
    if (!placed && bagItems.length === 0) {
      navigate("/bag", { replace: true });
    }
  }, [bagItems.length, placed, navigate]);

  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 0;
  const total = bagSubtotal + shippingCost;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in before placing your order.");
      return;
    }
    setPlacing(true);
    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          shippingCost,
          shipping: {
            ...form,
            method: shippingMethod,
          },
        }),
      });
      setPlaced(true);
      await clearBag();
    } catch (error) {
      alert(error.message || "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="checkout-page">
        <div className="order-confirmation">
          <i className="fa-regular fa-circle-check"></i>
          <h1>Thank you, {form.fullName || "Guest"}.</h1>
          <p>Your order has been placed and a confirmation has been sent to {form.email || "your email"}.</p>
          <Link to="/" className="continue-shopping-btn">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="page-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/bag">Your Bag</Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <h1 className="checkout-title">Checkout</h1>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        {/* SHIPPING */}
        <div className="checkout-form">
          <section className="checkout-section">
            <h2>Shipping Address</h2>

            <div className="form-grid">
              <label className="field">
                <span>Full Name</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+213 ..."
                  required
                />
              </label>

              <label className="field">
                <span>Address</span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </label>

              <label className="field">
                <span>City</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Postal Code</span>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field field-full">
                <span>Country</span>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Shipping Method</h2>

            <div className="shipping-options">
              {SHIPPING_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`shipping-option ${
                    shippingMethod === method.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id)}
                  />
                  <span>{method.label}</span>
                  <span className="shipping-price">
                    ${method.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="checkout-section">
            <h2>Delivery Notes (optional)</h2>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions..."
            />
          </section>
        </div>

        {/* ORDER SUMMARY */}
        <aside className="order-summary">
          <h2>Your Order</h2>

          <div className="checkout-items">
            {bagItems.map((item) => (
              <div className="checkout-item" key={item.key}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className="checkout-item-info">
                  <p className="checkout-item-title">{item.title}</p>
                  <p className="checkout-item-meta">
                    Qty {item.qty}
                    {item.size ? ` · ${item.size}` : ""}
                  </p>
                </div>
                <span className="checkout-item-price">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${bagSubtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button type="submit" className="place-order-btn" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
