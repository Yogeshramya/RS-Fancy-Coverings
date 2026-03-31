"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  ArrowUpDown,
  Tag
} from "lucide-react";
import Link from "next/link";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this exquisite piece? This cannot be undone.")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-premium font-bold tracking-tight mb-2">Jewelry Inventory</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Manage your Luxury Collection</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 px-6 py-3 bg-gold-primary text-white text-xs uppercase tracking-widest font-bold shadow-lg shadow-gold-primary/20 hover:bg-gold-accent transition-all"
        >
          <Plus size={16} />
          Add New Piece
        </Link>
      </header>

      {loading ? (
        <div className="py-20 text-center font-premium text-xl text-foreground/20 italic">Loading your collection...</div>
      ) : (
        <div className="bg-white border border-gold-primary/10 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-gold-primary/10">
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Product</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Category</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Price</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Stock Status</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gold-soft/5 transition-colors">
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-12 h-16 bg-gold-soft/20 flex-shrink-0">
                      <img 
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200"} 
                        alt={product.name_en} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-premium font-bold text-sm tracking-tight">{product.name_en}</p>
                      <p className="text-[10px] font-sans text-foreground/40 uppercase tracking-widest mt-1">ID: {product._id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="p-6 align-middle">
                    <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-bold uppercase tracking-widest bg-gold-soft/10 px-3 py-1.5 w-fit">
                      <Tag size={12} className="text-gold-primary/40" />
                      {product.category}
                    </div>
                  </td>
                  <td className="p-6 align-middle font-sans font-bold text-sm text-gold-primary">
                    ₹{product.price}
                  </td>
                  <td className="p-6 align-middle">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-foreground/70'}`}>
                          {product.stock} units
                        </span>
                        {product.stock <= 5 && <AlertTriangle size={14} className="text-red-400" />}
                      </div>
                      <p className="text-[9px] text-foreground/30 uppercase tracking-widest font-bold">Warehouse A</p>
                    </div>
                  </td>
                  <td className="p-6 align-middle space-x-3">
                    <Link 
                      href={`/admin/products/edit/${product._id}`}
                      className="inline-block p-2 text-gold-primary hover:bg-gold-soft/20 transition-colors border border-gold-primary/10" 
                      title="Edit Piece"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button 
                      onClick={() => deleteProduct(product._id)}
                      className="p-2 text-red-400 hover:bg-red-50 transition-colors border border-red-50" 
                      title="Remove Piece"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
