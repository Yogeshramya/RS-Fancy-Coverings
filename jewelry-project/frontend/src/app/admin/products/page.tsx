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

import { API_BASE_URL } from "@/config/apiConfig";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
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
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      product.name_en.toLowerCase().includes(search) ||
      product.name_ta?.toLowerCase().includes(search) ||
      (product.productId && product.productId.toLowerCase().includes(search)) ||
      product._id.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-premium font-bold tracking-tight mb-2">Jewelry Inventory</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Manage your Luxury Collection</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
          {/* Search Bar */}
          <div className="relative group w-full sm:min-w-[300px]">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/40 group-focus-within:text-gold-primary transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search..."
               className="w-full pl-12 pr-10 py-3 bg-white border border-gold-primary/10 text-xs focus:border-gold-primary outline-none transition-all shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             {searchTerm && (
               <button 
                 onClick={() => setSearchTerm("")}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-red-400 p-1 transition-colors"
                 title="Clear search"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             )}
          </div>

          <Link 
            href="/admin/products/new" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-primary text-white text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-gold-primary/20 hover:bg-gold-accent transition-all"
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add New Piece</span>
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center font-premium text-xl text-foreground/20 italic">Loading your collection...</div>
      ) : (
        <div className="bg-white border border-gold-primary/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gold-primary/20">
            <table className="w-full text-left border-collapse min-w-[1000px]">
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
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
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
                        <p className="text-[10px] font-sans text-gold-primary uppercase tracking-widest mt-1 font-bold">ID: {product.productId || product._id.slice(-6)}</p>
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
                )) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <p className="font-premium text-lg text-foreground/30 italic">No pieces found matching "{searchTerm}"</p>
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:underline"
                      >
                        Clear Search
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
