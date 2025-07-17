const apiBase = "https://fastapi-backend-sbk4.onrender.com";

export const listProducts = async () => {
  const res = await fetch(`${apiBase}/list_products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const addProduct = async (product) => {
  const res = await fetch(`${apiBase}/add_product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
};
