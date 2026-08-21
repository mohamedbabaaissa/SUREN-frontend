import "./Header.css";
import Img, { logo } from "../assets/Export";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { apiFetch, normalizeProduct } from "../lib/api";
import AuthModal from "./AuthModal";
import "./AuthModal.css";

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { bagCount, wishlist, user, logout } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

 
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(() => {
      apiFetch(`/products?search=${encodeURIComponent(query)}&limit=6&page=1`)
        .then((data) => {
          setResults((data.products || []).map(normalizeProduct));
          setSearching(false);
        })
        .catch(() => {
          setResults([]);
          setSearching(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(`/product/${results[0].id}`);
      closeSearch();
    }
  };

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    closeSearch();
  };

 
  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="header">
  
      <nav className="header-left">
        
        <NavLink
          to="/"
          end
          state={{ scrollToCollection: true }}
          className={navLinkClass}
        >
          Collections
        </NavLink>

      </nav>

   
      <div className="logo">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Img src={logo} alt="SUREN" className="logo-image" />
          <span>SUREN</span>
        </Link>
      </div>

      
      <nav className="header-right">
        {/* Pioi eimaste mean about us  */}
        <Link to="#" className="nav-link">
          Pioi eimaste
        </Link>

        <div className="divider" />

        <div className="header-icons">
          
          <div className="header-search" ref={searchRef}>
            {searchOpen && (
              <form onSubmit={handleSubmit} className="search-form">
                <input
                  className="search-input"
                  placeholder="What are you looking for?"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (searchOpen) closeSearch();
              }}
              aria-label="Toggle search"
            >
              <i
                className={`fa-solid ${
                  searchOpen ? "fa-xmark" : "fa-magnifying-glass"
                }`}
              />
            </button>

            
            {searchOpen && query.trim() && (
              <div className="search-results">
                {searching && <p className="search-status">Searching...</p>}

                {!searching && results.length === 0 && (
                  <p className="search-status">
                    No products found for &ldquo;{query}&rdquo;
                  </p>
                )}

                {!searching &&
                  results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="search-result-item"
                      onClick={() => goToProduct(product.id)}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <span>
                        <span className="search-result-title">
                          {product.title}
                        </span>
                        <span className="search-result-price">
                          ${product.price}
                        </span>
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? "icon-link active" : "icon-link"
            }
            aria-label="Wishlist"
          >
            <i className="fa-regular fa-heart" />
            {wishlist.length > 0 && (
              <span className="icon-badge">{wishlist.length}</span>
            )}
          </NavLink>

    
          <NavLink
            to="/bag"
            className={({ isActive }) =>
              isActive ? "icon-link active" : "icon-link"
            }
            aria-label="Shopping Bag"
          >
            <i className="fa-solid fa-bag-shopping" />
            {bagCount > 0 && <span className="icon-badge">{bagCount}</span>}
          </NavLink>

          <div className="header-profile" ref={profileRef}>
            <button
              type="button"
              className="profile"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Account"
            >
              <i className="fa-regular fa-user" />
            </button>

            {profileOpen && (
              <div className="profile-menu">
                {user ? (
                  <ul className="profile-menu-list">
                    <li className="profile-user">
                      <strong>{user.name || "Account"}</strong>
                      <small>{user.email}</small>
                    </li>

                    {user.role === "admin" && (
                      <li>
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="profile-menu-list">
                    <li>
                      <button
                        type="button"
                        className="profile-sign-in"
                        onClick={() => {
                          setIsAuthOpen(true);
                          setProfileOpen(false);
                        }}
                      >
                        Sign in to access your account.
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}

export default Header;
