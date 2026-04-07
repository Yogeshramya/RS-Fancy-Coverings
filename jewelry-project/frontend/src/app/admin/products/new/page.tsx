"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  Type,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/config/apiConfig";

export default function NewProductAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name_en: "",
    name_ta: "",
    productId: "",
    description_en: "",
    description_ta: "",
    price: "",
    stock: "",
    category: "Earrings",
    images: [""] // Used for manual URL input
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalProductId = formData.productId || `RS-${Math.floor(10000 + Math.random() * 90000)}`;

    const data = new FormData();
    data.append("name_en", formData.name_en);
    data.append("name_ta", formData.name_ta);
    data.append("productId", finalProductId);
    data.append("description_en", formData.description_en);
    data.append("description_ta", formData.description_ta);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    
    // Append files
    selectedFiles.forEach(file => {
      data.append("images", file);
    });

    // If no files selected but URL is provided, send the URL
    if (selectedFiles.length === 0 && formData.images[0]) {
      data.append("images", formData.images[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: data
      });
      if (res.ok) {
        alert(`Jewelry piece added! Product ID: ${finalProductId}`);
        router.push("/admin/products");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-foreground/40 hover:text-gold-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-premium font-bold tracking-tight mb-1">Add New Jewel</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold tracking-widest">Create a masterpiece</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Core Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">1. Catalog Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gold-primary">Product ID / SKU</label>
                <input 
                  type="text" 
                  placeholder="e.g. RS-101 (Auto if blank)"
                  className="w-full p-4 bg-background border border-gold-primary/20 text-sm focus:border-gold-primary outline-none transition-all font-bold"
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Name (English)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Elegant Gold Jhumkas"
                  className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Name (Tamil)</label>
                <input 
                  type="text" 
                  required
                  placeholder="நேர்த்தியான தங்க ஜிமிக்கி"
                  className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                  value={formData.name_ta}
                  onChange={(e) => setFormData({...formData, name_ta: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Description (English)</label>
              <textarea 
                rows={4}
                placeholder="High-quality gold plated jhumkas with premium stones..."
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Description (Tamil)</label>
              <textarea 
                rows={4}
                placeholder="உயர்தர தங்க முலாம் பூசிய ஜிமிக்கிகள்..."
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all"
                value={formData.description_ta}
                onChange={(e) => setFormData({...formData, description_ta: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">2. Visual Assets</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 block">Product Photos (Up to 5)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gold-primary/20 bg-gold-soft/5 text-gold-primary hover:bg-gold-soft/20 transition-all w-full">
                    <Plus size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Select Masterpiece Photos</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="relative border-t border-gold-primary/5 pt-6">
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white px-4 text-[9px] uppercase tracking-widest text-foreground/20 font-bold">OR</div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 block mb-4">Paste Image URL (Fallback)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-12 pr-4 py-4 bg-background border border-gold-primary/10 text-xs focus:border-gold-primary outline-none transition-all"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                  />
                </div>
              </div>

              {/* Previews */}
              {(previews.length > 0 || (selectedFiles.length === 0 && formData.images[0])) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previews.length > 0 ? (
                    previews.map((preview, i) => (
                      <div key={i} className="relative aspect-square bg-gold-soft/10 border border-gold-primary/10 overflow-hidden group">
                        <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[8px] uppercase tracking-widest font-bold">Photo {i + 1}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    formData.images[0] && (
                      <div className="relative aspect-square bg-gold-soft/10 border border-gold-primary/10 overflow-hidden group">
                        <img src={formData.images[0]} alt="Preview URL" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[8px] uppercase tracking-widest font-bold">URL Preview</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <p className="text-[9px] text-foreground/30 uppercase tracking-wider font-medium italic">Tip: Use high-quality JPG or PNG files for the best boutique experience.</p>
            </div>
          </div>
        </div>

        {/* Categories & Price */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gold-primary/10 p-10 shadow-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-6">3. Inventory Status</h2>
            
            <div className="space-y-4 text-left">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Category</label>
              <select 
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-all appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {["Earrings", "Necklaces", "Bangles", "Others"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 text-left">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Retail Price (₹)</label>
              <input 
                type="number" 
                required
                placeholder="₹850"
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm font-bold focus:border-gold-primary outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-4 text-left">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Current Stock Count</label>
              <input 
                type="number" 
                required
                placeholder="20"
                className="w-full p-4 bg-background border border-gold-primary/10 text-sm font-bold focus:border-gold-primary outline-none transition-all"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 flex items-center justify-center gap-2 uppercase tracking-[0.3em] text-[11px] font-bold transition-all shadow-lg ${
                loading ? "bg-gray-400" : "bg-gold-primary text-white hover:bg-gold-accent shadow-gold-primary/20"
              }`}
            >
              {loading ? "Adding..." : <><Save size={16} /> Save Masterpiece</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
