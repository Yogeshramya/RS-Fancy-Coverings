"use client";
// Forced recompile to update QR code with new UPI ID

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { QRCodeCanvas } from "qrcode.react";

import { API_BASE_URL } from "@/config/apiConfig";

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  
  const nameSummary = params.get("name") || "Jewelry Item";
  
  // Calculate subtotal from URL or Cart
  const subtotal = cartItems.length > 0 
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : Number(params.get("subtotal") || "0");

  // Consistent Delivery Logic: 50 if < 500, else 0
  const deliveryCharge = (subtotal > 0 && subtotal < 500) ? 50 : 0;
  const totalPrice = subtotal + deliveryCharge;
  
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    upiLast4: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upiId = "rameshranjani410@okicici"; 
  const upiLink = `upi://pay?pa=${upiId}&pn=RSFancyCoverings&am=${totalPrice}&cu=INR`;

  const handleSubmitOrder = async () => {
    if (!formData.customerName || !formData.phone || !formData.address || !formData.upiLast4) {
      alert("Please fill in all shipping and payment details.");
      return;
    }

    if (formData.upiLast4.length !== 4) {
      alert("Please enter exactly 4 digits of the transaction ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryId = params.get("id");
      const sku = params.get("sku") || "";
      
      // Prepare the order data
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        upiLast4: formData.upiLast4,
        totalPrice: Number(totalPrice),
        deliveryCharge: Number(deliveryCharge),
        orderType: "UPI",
        items: cartItems.length > 0 ? cartItems.map(item => ({
          productId: item._id,
          sku: item.productId || "",
          name: item.name_en,
          price: item.price,
          quantity: item.quantity
        })) : [{ 
          productId: summaryId, 
          sku: sku,
          name: nameSummary, 
          price: Number(totalPrice), 
          quantity: 1 
        }]
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        router.push("/order-success");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Could not connect to the server. Your payment is safe, please contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white border border-gold-primary/20 p-8 shadow-xl">
          <h1 className="text-3xl font-premium font-bold mb-8 tracking-tight text-center">Checkout & Shipping</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Step 1: Shipping Details */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-4">1. Shipping Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Whatsapp Number"
                  className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <textarea
                  placeholder="Shipping Address"
                  rows={3}
                  className="w-full p-3 bg-background border border-gold-primary/10 text-sm focus:border-gold-primary outline-none transition-colors"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="p-4 bg-gold-soft/20 border border-gold-primary/10 mt-8 space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-foreground/60">
                  <span>Subtotal</span>
                  <span className="font-sans">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-foreground/60 pb-2 border-b border-gold-primary/10">
                  <span>Delivery</span>
                  <span className="font-sans">{Number(deliveryCharge) === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="py-2 px-3 bg-gold-primary/5 rounded-sm border border-gold-primary/10 animate-pulse">
                    <p className="text-[9px] uppercase tracking-wider text-gold-primary font-bold text-center">
                      Add ₹{500 - subtotal} more for <span className="underline underline-offset-2">FREE Delivery!</span>
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">Total Bill</p>
                  <p className="text-2xl font-bold font-sans text-gold-primary">₹{totalPrice}</p>
                </div>
                <p className="text-[9px] text-foreground/50 mt-1 italic">{nameSummary}</p>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gold-primary mb-4">2. Payment Verification</h2>
              
              <div className="bg-white p-6 text-center border border-gold-primary/10 shadow-sm mb-6 flex flex-col items-center">
                <div className="p-4 bg-white border border-gold-primary/10 shadow-inner rounded-sm mb-4">
                  <QRCodeCanvas
                    value={upiLink}
                    size={200}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/rs-logo.png",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold-primary">Scan to Pay ₹{totalPrice}</p>
                  <a 
                    href={upiLink} 
                    className="block text-[9px] uppercase tracking-widest text-foreground/40 hover:text-gold-primary underline transition-colors"
                  >
                    Click to pay with UPI App
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-foreground/60 mb-2">Enter Last 4 Digits of Transaction ID</p>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  className="w-full p-3 bg-background border border-gold-primary/10 text-lg font-mono text-center tracking-[0.5em] focus:border-gold-primary outline-none"
                  value={formData.upiLast4}
                  onChange={(e) => setFormData({ ...formData, upiLast4: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className={`w-full py-4 uppercase tracking-[0.2em] text-[11px] font-bold transition-all shadow-lg ${
                  isSubmitting ? "bg-gray-400" : "bg-gold-primary text-white hover:bg-gold-accent shadow-gold-primary/20"
                }`}
              >
                {isSubmitting ? "Processing..." : "Confirm Payment & Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-premium text-2xl">Loading Payment System...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
