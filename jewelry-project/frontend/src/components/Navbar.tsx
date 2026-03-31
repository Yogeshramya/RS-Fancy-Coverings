"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Globe, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Shop All", href: "/#products" },
    { name: "Earrings", href: "/?category=Earrings#products" },
    { name: "Necklaces", href: "/?category=Necklaces#products" },
    { name: "Bangles", href: "/?category=Bangles#products" },
    { name: "Others", href: "/?category=Others#products" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gold-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Menu Mobile Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2 hover:text-gold-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-premium tracking-widest gold-text-gradient font-bold">
              RS FANCY COVERINGS
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm uppercase tracking-widest hover:text-gold-primary transition-colors font-sans"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Icons & Lang */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              className="flex items-center text-[10px] md:text-xs uppercase tracking-widest hover:text-gold-primary transition-colors"
            >
              <Globe size={16} className="mr-1 hidden sm:block" />
              {language === "en" ? "Tamil" : "English"}
            </button>
            <Link href="/cart" className="relative text-foreground hover:text-gold-primary transition-colors">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 md:hidden shadow-2xl border-r border-gold-primary/10"
            >
              <div className="p-6 border-b border-gold-primary/10 flex justify-between items-center">
                <span className="text-xl font-premium tracking-widest gold-text-gradient font-bold">RS FANCY COVERINGS</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground/40 p-2">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg uppercase tracking-[0.2em] font-medium hover:text-gold-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-center pt-8 border-t border-gold-primary/5">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Exclusive Collection</p>
                <p className="text-xs text-gold-primary font-bold">Quality Indian Jewelry</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
