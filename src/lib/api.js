const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export const getToken = () => {
  return localStorage.getItem("suren_token");
};

export const setAuth = (token, user) => {
  localStorage.setItem("suren_token", token);
  localStorage.setItem("suren_user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("suren_token");
  localStorage.removeItem("suren_user");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("suren_user")
    ) || null;
  } catch {
    return null;
  }
};

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = new Headers(
    options.headers || {}
  );

  
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};



export const normalizeProduct = (product) => {
  if (!product) return null;

  const id =
    product._id ||
    product.id;

 
  let images = [];

  

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    images = product.images;
  }



  else if (product.image) {
    images = [product.image];
  }

 

  images = images.map((image) => {

    if (!image) {
      return "";
    }

   

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }


    const backendUrl =
      API_BASE_URL.replace(
        "/api",
        ""
      );

    return `${backendUrl}${
      image.startsWith("/")
        ? ""
        : "/"
    }${image}`;
  });


  const image =
    images[0] || "";


  return {
    ...product,

    id,

    title:
      product.title ||
      product.name ||
      "Untitled Product",

    name:
      product.name ||
      product.title ||
      "Untitled Product",

    thumbnail: image,

    images,
  };
};


export const normalizeCart = (cart) => ({
  ...cart,

  items: (cart?.items || [])
    .filter(
      (item) => item.product
    )

    .map((item) => {

      const product =
        normalizeProduct(
          item.product
        );

      return {
        key: product.id,

        id: product.id,

        title:
          product.title,

        price:
          Number(
            product.price
          ) || 0,

        thumbnail:
          product.thumbnail,

        size: "",

        color: "",

        qty:
          item.quantity,

        quantity:
          item.quantity,
      };
    }),
});



export {
  API_BASE_URL
};