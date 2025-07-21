import { useState, useEffect } from "react";
export default function ProductForm({api, refresh, editing, setEditing, setMessage}) {
  const [form, setForm] = useState({name:'',brand:'',category:'',price:'',image:null});
  useEffect(()=>{ editing ? setForm(editing) : setForm({name:'',brand:'',category:'',price:'',image:null}) },[editing]);

  const submit = async()=>{
    if (!form.name||!form.brand||!form.category||!form.price){setMessage("Fill all"); return;}
    const fd=new FormData();
    fd.append('name', form.name);
    fd.append('brand', form.brand);
    fd.append('category', form.category);
    fd.append('price', form.price);
    if(form.image) fd.append('image', form.image);
    try{
      if(editing){
        await fetch(api+`/update_product/${editing.id}`,{method:"PUT",body:fd});
        setMessage("✅ Updated!");
      }else{
        await fetch(api+"/add_product",{method:"POST",body:fd});
        setMessage("✅ Added!");
      }
      refresh(); setEditing(null); setForm({name:'',brand:'',category:'',price:'',image:null});
    }catch{setMessage("❌ Failed");}
  };
  return (
    <div className="mb-3">
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="form-control mb-1" />
      <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="form-control mb-1" />
      <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="form-control mb-1" />
      <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="form-control mb-1" />
      <input type="file" onChange={e=>setForm({...form,image:e.target.files[0]})} className="form-control mb-1" />
      <button className="btn btn-success me-2" onClick={submit}>{editing?"Update":"Add"} Product</button>
      {editing && <button className="btn btn-secondary" onClick={()=>{setEditing(null); setForm({name:'',brand:'',category:'',price:'',image:null})}}>Cancel</button>}
    </div>
  );
}
