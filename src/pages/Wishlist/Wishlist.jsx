import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist, removeFromWishlist, addToBag } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wishlist-page">
      <div className="page-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Wishlist</span>
      </div>

      <h1 className="wishlist-title">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>You haven't saved anything yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Discover the Collection
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div className="wishlist-card" key={product.id}>
              <button
                className="wishlist-remove"
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <Link to={`/product/${product.id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <div className="wishlist-card-info">
                <h3>
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h3>
                <p>${product.price}</p>

                <button
                  className="wishlist-add-btn"
                  onClick={() => addToBag(product)}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
