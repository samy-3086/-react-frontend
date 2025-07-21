export default function ProductCard({product, api, refresh, setEditing}) {
  return (
    <div className="card">
      <img src={api+product.image_url} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5>{product.name}</h5>
        <p>{product.brand} | {product.category} | ₹{product.price.toLocaleString()}</p>
        <button className="btn btn-primary btn-sm me-2" onClick={()=>setEditing(product)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={async()=>{
          await fetch(api+`/delete_product/${product.id}`, {method:"DELETE"});
          refresh();
        }}>Delete</button>
      </div>
    </div>
  );
}
