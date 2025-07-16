import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    image_url: ''
  });

  const apiBase = "https://fastapi-backend-sbk4.onrender.com";

  // Load products on mount
  useEffect(() => {
    fetch(`${apiBase}/list_products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch(`${apiBase}/add_product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          category: form.category,
          price: parseFloat(form.price),
          image_url: form.image_url
        })
      });
      if (!response.ok) throw new Error('Failed to add product');

      // Refresh product list
      const res = await fetch(`${apiBase}/list_products`);
      const data = await res.json();
      setProducts(data);
      // Reset form
      setForm({ name:'', brand:'', category:'', price:'', image_url:'' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Products</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Brand"
          value={form.brand}
          onChange={e => setForm({ ...form, brand: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={e => setForm({ ...form, image_url: e.target.value })}
        />
        <button onClick={handleCreate}>Add Product</button>
      </div>
      <table border="1" style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>
                {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 50 }} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
