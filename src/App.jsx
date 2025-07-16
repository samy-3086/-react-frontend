import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name:'', brand:'', category:'', price:'', image_url:'' });

  const api = "https://fastapi-backend-sbk4.onrender.com"; // change to Render URL after deploy

  useEffect(() => { fetch(api).then(r=>r.json()).then(setProducts); }, []);

  const handleCreate = async () => {
    await fetch(api+"?"+new URLSearchParams(form), { method:"POST" });
    const res = await fetch(api); setProducts(await res.json());
  }

  return (
    <div>
      <h1>Products</h1>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Brand" onChange={e=>setForm({...form,brand:e.target.value})} />
      <input placeholder="Category" onChange={e=>setForm({...form,category:e.target.value})} />
      <input placeholder="Price" onChange={e=>setForm({...form,price:e.target.value})} />
      <input placeholder="Image URL" onChange={e=>setForm({...form,image_url:e.target.value})} />
      <button onClick={handleCreate}>Create</button>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Brand</th><th>Price</th></tr></thead>
        <tbody>
          {products.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.brand}</td><td>{p.price}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
export default App;
