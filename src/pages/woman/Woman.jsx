import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { womanpage } from "../../assets/Export";
import { useStore } from "../../context/StoreContext";
import { apiFetch, normalizeProduct } from "../../lib/api";
import "../woman/Woman.css";
import "./Woman.css";

function Woman() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const { toggleWishlist, isWishlisted, addToBag } = useStore();

  const productsPerPage = 12;

  useEffect(() => {
    let active = true;

    setLoading(true);

    apiFetch(
      `/products?page=${currentPage}&limit=${productsPerPage}&gender=women,unisex,`
    )
      .then((data) => {
        if (!active) return;

        setProducts((data.products || []).map(normalizeProduct));

        setTotalPages(data.totalPages || 1);

        setTotalProducts(data.totalProducts || 0);
      })
      .catch((e) => {
        console.error("Error fetching women's products:", e);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      pages.push(1, "...");

      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <>
      {/* BREADCRUMB */}

      <div className="page-breadcrumb">
        <Link to="/">Home</Link>

        <span>/</span>

        <span>Women's Collection</span>
      </div>

      {/* HERO */}

      <section className="page-hero">
        <img
          src={womanpage}
          alt="Women's Collection"
          className="breadcrumb-image"
          loading="lazy"
          decoding="async"
        />

        <div className="hero-overlay" />

        <div className="page-hero-content">
          <p className="page-season">SPRING / SUMMER 2026</p>

          <h1>Women's</h1>

          <h2>Collection</h2>

          <p className="page-tagline">
            Flowing silhouettes &amp; sun-bleached hues crafted for the
            Mediterranean light.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="products-section">
        <div className="products-header">
          <p className="products-count">{totalProducts} pieces</p>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="loading">No women's products found.</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  {Number(product.stock) === 0 && (
                    <span className="product-stock-badge">Unavailable</span>
                  )}
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>

                  <button
                    className="product-wishlist"
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle wishlist"
                  >
                    <i
                      className={
                        isWishlisted(product.id)
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      }
                    />
                  </button>
                </div>

                <div className="product-info">
                  <h3>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>

                  <p className="product-price">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="pagination">
            {getPages().map((page, index) =>
              page === "..." ? (
                <span key={`dots-${index}`} className="pagination-dots">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "pagination-btn active"
                      : "pagination-btn"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Woman;
