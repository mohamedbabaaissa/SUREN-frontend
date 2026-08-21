import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  apiFetch,
  clearAuth,
  getStoredUser,
  getToken,
  normalizeCart,
  normalizeProduct,
  setAuth,
} from "../lib/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [bagItems, setBagItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(Boolean(getToken()));

  const loadCart = useCallback(async () => {
    if (!getToken()) {
      setBagItems([]);
      return;
    }
    try {
      const data = await apiFetch("/cart");
      setBagItems(normalizeCart(data.cart).items);
    } catch (error) {
      if (error.status === 401) {
        clearAuth();
        setUser(null);
        setBagItems([]);
      } else {
        console.error("Load cart error:", error);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      if (!getToken()) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/auth/me");
        if (!active) return;
        setUser(data.user);
        localStorage.setItem("suren_user", JSON.stringify(data.user));
        await loadCart();
      } catch {
        if (active) {
          clearAuth();
          setUser(null);
          setBagItems([]);
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    restoreSession();
    return () => { active = false; };
  }, [loadCart]);

  const login = useCallback(async (credentials) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setAuth(data.token, data.user);
    setUser(data.user);
    await loadCart();
    return data;
  }, [loadCart]);

  const register = useCallback(async (payload) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuth(data.token, data.user);
    setUser(data.user);
    await loadCart();
    return data;
  }, [loadCart]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setBagItems([]);
  }, []);

  const addToBag = useCallback(async (product, options = {}) => {
    if (!user) throw new Error("Please sign in before adding products to your bag.");
    const { qty = 1 } = options;
    const data = await apiFetch("/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: qty }),
    });
    setBagItems(normalizeCart(data.cart).items);
    return data.cart;
  }, [user]);

  const removeFromBag = useCallback(async (key) => {
    if (!user) return;
    const data = await apiFetch(`/cart/${key}`, { method: "DELETE" });
    setBagItems(normalizeCart(data.cart).items);
  }, [user]);

  const updateBagQty = useCallback(async (key, qty) => {
    if (!user) return;
    if (qty <= 0) return removeFromBag(key);
    const data = await apiFetch(`/cart/${key}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: qty }),
    });
    setBagItems(normalizeCart(data.cart).items);
  }, [removeFromBag, user]);

  const clearBag = useCallback(async () => {
    if (!user) {
      setBagItems([]);
      return;
    }
    try {
      const data = await apiFetch("/cart", { method: "DELETE" });
      setBagItems(normalizeCart(data.cart).items);
    } catch (error) {
      if (error.status === 404) setBagItems([]);
      else throw error;
    }
  }, [user]);

  const bagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.qty, 0),
    [bagItems]
  );

  const bagSubtotal = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [bagItems]
  );

  const toggleWishlist = useCallback((product) => {
    const normalized = normalizeProduct(product);
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      if (exists) return prev.filter((item) => item.id !== normalized.id);
      return [...prev, normalized];
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      bagItems,
      addToBag,
      removeFromBag,
      updateBagQty,
      clearBag,
      bagCount,
      bagSubtotal,
      wishlist,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshCart: loadCart,
    }),
    [bagItems, addToBag, removeFromBag, updateBagQty, clearBag, bagCount, bagSubtotal,
      wishlist, toggleWishlist, isWishlisted, removeFromWishlist, user, authLoading,
      login, register, logout, loadCart]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
