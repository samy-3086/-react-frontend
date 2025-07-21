import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

const api = "https://fastapi-backend-sbk4.onrender.com";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // id if editing
  const [message, setMessage] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const searchQ = query.get('q') || '';

  const load = async ()=> {
    try{
      const res = await fetch(api+"/list_products");
      const data = await res.json();
      setProducts(data);
    }catch{setMessage("❌ Failed to load");}
  };
  useEffect(()=>{ load(); },[]);

  const filtered = products.filter(p=>p.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div>
      <h2>Products</h2>
      {message && <p>{message}</p>}
      <ProductForm api={api} refresh={load} editing={editing} setEditing={setEditing} setMessage={setMessage} />
      <div className="row">
        {filtered.map(p=>
          <div className="col-md-4 mb-3" key={p.id}>
            <ProductCard product={p} api={api} refresh={load} setEditing={setEditing} />
          </div>
        )}
      </div>
    </div>
  );
}
