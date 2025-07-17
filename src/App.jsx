import { useState, useEffect } from 'react';
import { listProducts, addProduct } from './api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name:'', brand:'', category:'', price:'', image_url:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(data);
    } catch (e) {
      setMessage('❌ Failed to load products');
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.brand || !form.category || !form.price) {
      setMessage('❌ Please fill in all fields');
      return;
    }
    try {
      await addProduct({ 
        name: form.name, 
        brand: form.brand, 
        category: form.category, 
        price: parseFloat(form.price), 
        image_url: form.image_url 
      });
      setMessage('✅ Product added successfully!');
      setForm({ name:'', brand:'', category:'', price:'', image_url:'' });
      await loadProducts();
    } catch (e) {
      setMessage('❌ Failed to add product');
    }
  };

  return (
    <div className="container">
      <h1>📦 Product Manager</h1>

      <div className="form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
        <button onClick={handleAdd}>Add Product</button>
      </div>

      {message && <div className="message">{message}</div>}
      {loading ? <p>Loading...</p> : (
        <table>
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
                <td>₹{p.price.toLocaleString()}</td>
                <td>{p.image_url && <img src={p.image_url} alt={p.name} width="80" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
