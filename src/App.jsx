import { useState, useEffect } from 'react';
import './App.css';

const api = "https://fastapi-backend-sbk4.onrender.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id:null, name:'', brand:'', category:'', price:'', image_url:'' });
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch(api+"/list_products");
      const data = await res.json();
      setProducts(data);
    } catch {
      setMessage("❌ Failed to load products");
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.category || !form.price) {
      setMessage("❌ Please fill in all fields");
      return;
    }
    try {
      if (editing) {
        await fetch(api+"/update_product", {
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ ...form, price:parseFloat(form.price) })
        });
        setMessage("✅ Product updated!");
      } else {
        await fetch(api+"/add_product", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ ...form, price:parseFloat(form.price) })
        });
        setMessage("✅ Product added!");
      }
      setForm({ id:null, name:'', brand:'', category:'', price:'', image_url:'' });
      setEditing(false);
      loadProducts();
    } catch {
      setMessage("❌ Operation failed");
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(api+`/delete_product/${id}`, { method:"DELETE" });
      setMessage("✅ Product deleted!");
      loadProducts();
    } catch {
      setMessage("❌ Failed to delete");
    }
  };

  return (
    <div className="container">
      <h1>🩵 SVKS Store Manager</h1>
      <div className="form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
        <button onClick={handleSubmit}>{editing ? "Update" : "Add"} Product</button>
        {editing && <button onClick={()=>{setForm({ id:null, name:'', brand:'', category:'', price:'', image_url:'' }); setEditing(false);}}>Cancel</button>}
      </div>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Image</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p=>(
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>₹{p.price.toLocaleString()}</td>
              <td>{p.image_url && <img src={p.image_url} alt="" width="50"/>}</td>
              <td>
                <button onClick={()=>handleEdit(p)}>✏️</button>
                <button onClick={()=>handleDelete(p.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
