import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import { useStore } from "../../context/StoreContext";

import {
  apiFetch,
  normalizeProduct,
} from "../../lib/api";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    addToBag,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const [product, setProduct] =
    useState(null);

  // SELECTED IMAGE

  const [selectedImage, setSelectedImage] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("M");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [justAdded, setJustAdded] =
    useState(false);

  // LOAD PRODUCT=

  useEffect(() => {
    window.scrollTo(0, 0);

    setLoading(true);

    apiFetch(`/products/${id}`)
      .then((data) => {
        const normalized =
          normalizeProduct(
            data.product
          );

        setProduct(normalized);

        // Set first image as main image
        if (normalized) {
          const firstImage =
            normalized.images?.[0] ||
            normalized.thumbnail ||
            "";

          setSelectedImage(firstImage);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "Error fetching product:",
          err
        );

        setLoading(false);
      });
  }, [id]);

  // LOADING


  if (loading) {
    return (
      <div className="loading">
        Loading details...
      </div>
    );
  }

  // ==================================================
  // PRODUCT NOT FOUND
  // ==================================================

  if (!product) {
    return (
      <div className="error">
        Product not found!
      </div>
    );
  }

  // ==================================================
  // ADD TO CART
  // ==================================================

  const handleAddToCart = async () => {
    try {
      await addToBag(product, {
        size: selectedSize,
        color: selectedColor,
        qty: 1,
      });

      setJustAdded(true);

      setTimeout(() => {
        setJustAdded(false);
      }, 1800);
    } catch (error) {
      alert(error.message);
    }
  };

  // ==================================================
  // SIZES
  // ==================================================

  const sizes = [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];

  // ==================================================
  // ALL PRODUCT IMAGES
  // ==================================================

  const productImages =
    product.images?.length
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : [];

  return (
    <div className="product-details-container">

      {/* ==========================================
          BREADCRUMB
      ========================================== */}

      <div className="page-breadcrumb">
        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <span>
          {product.title}
        </span>
      </div>

      {/* ==========================================
          PRODUCT CONTENT
      ========================================== */}

      <div className="product-details-content">

        {/* ========================================
            GALLERY
        ======================================== */}

        <div className="product-gallery">

          {/* MAIN IMAGE */}

          <div className="main-image">

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="no-image">
                No image available
              </div>
            )}

          </div>

          {/* ======================================
              THUMBNAILS
          ====================================== */}

          {productImages.length > 0 && (
            <div className="sub-images">

              {productImages
                .slice(0, 4)
                .map(
                  (img, idx) => (
                    <button
                      type="button"
                      key={`${img}-${idx}`}
                      className={
                        selectedImage === img
                          ? "thumbnail-btn active"
                          : "thumbnail-btn"
                      }
                      onClick={() =>
                        setSelectedImage(
                          img
                        )
                      }
                    >

                      <img
                        src={img}
                        alt={`Product view ${
                          idx + 1
                        }`}
                        loading="lazy"
                        decoding="async"
                      />

                    </button>
                  )
                )}

            </div>
          )}

        </div>

        {/* ========================================
            PRODUCT INFORMATION
        ======================================== */}

        <div className="product-buy-info">

          <h1>
            {product.title}
          </h1>

          <p className="product-price">
            ${product.price}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          {/* ====================================
              SIZE
          ==================================== */}

          <div className="option-group">

            <label>
              SIZE
            </label>

            <div className="size-buttons">

              {sizes.map(
                (size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${
                      selectedSize ===
                      size
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedSize(
                        size
                      )
                    }
                  >
                    {size}
                  </button>
                )
              )}

            </div>

          </div>

          {/* ====================================
              ACTION BUTTONS
          ==================================== */}

          <div className="product-actions">

            <button
              type="button"
              className="add-to-cart-btn"
              onClick={
                handleAddToCart
              }
            >
              {justAdded
                ? "ADDED ✓"
                : "ADD TO BAG"}
            </button>

            <button
              type="button"
              className="wishlist-toggle-btn"
              onClick={() =>
                toggleWishlist(
                  product
                )
              }
              aria-label="Toggle wishlist"
            >
              <i
                className={
                  isWishlisted(
                    product.id
                  )
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
              ></i>
            </button>

          </div>

          {/* ====================================
              VIEW BAG
          ==================================== */}

          {justAdded && (
            <button
              type="button"
              className="view-bag-link"
              onClick={() =>
                navigate("/bag")
              }
            >
              View Bag →
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;