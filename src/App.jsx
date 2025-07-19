import { useState, useEffect } from 'react';
import './App.css';

const api = "https://your-backend-domain"; // e.g., render or railway backend

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name:'', brand:'', category:'', price:'', image:null });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    try {
      const res = await fetch(api+"/list_products");
      const data = await res.json();
      setProducts(data);
    } catch { setMessage("❌ Failed to load"); }
  };
  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.brand || !form.category || !form.price) {
      setMessage("❌ Fill all fields"); return;
    }
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('brand', form.brand);
      fd.append('category', form.category);
      fd.append('price', form.price);
      if (form.image) fd.append('image', form.image);

      if (editing) {
        await fetch(api+`/update_product/${form.id}`, { method:"PUT", body: fd });
        setMessage("✅ Updated!");
      } else {
        await fetch(api+"/add_product", { method:"POST", body: fd });
        setMessage("✅ Added!");
      }
      setForm({ id:null, name:'', brand:'', category:'', price:'', image:null });
      setEditing(false);
      loadProducts();
    } catch { setMessage("❌ Failed"); }
  };

  return (
    <div className="container">
      <h1>🩵 SVKS Store Manager (File Upload)</h1>
      <div className="form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input type="file" onChange={e=>setForm({...form,image:e.target.files[0]})} />
        <button onClick={handleSubmit}>{editing ? "Update" : "Add"} Product</button>
        {editing && <button onClick={()=>{setForm({ id:null, name:'', brand:'', category:'', price:'', image:null }); setEditing(false);}}>Cancel</button>}
      </div>
      {message && <p>{message}</p>}
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Image</th><th>Actions</th></tr></thead>
        <tbody>
        {products.map(p=>(
          <tr key={p.id}>
            <td>{p.id}</td><td>{p.name}</td><td>{p.brand}</td><td>{p.category}</td>
            <td>₹{p.price.toLocaleString()}</td>
            <td><img src={api+p.image_url} width="50" /></td>
            <td>
              <button onClick={()=>{ setForm({...p, image:null}); setEditing(true); }}>✏️</button>
              <button onClick={async()=>{ await fetch(api+`/delete_product/${p.id}`,{method:"DELETE"}); loadProducts(); }}>🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
