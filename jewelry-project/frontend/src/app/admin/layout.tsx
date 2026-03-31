"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  PlusCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Inventory", icon: Package, href: "/admin/products" },
  { name: "Add Product", icon: PlusCircle, href: "/admin/products/new" },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, logout, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdmin, isLoading, pathname, router]);

  if (isLoading || (!isAdmin && pathname !== "/admin/login")) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center font-premium text-2xl animate-pulse">
        Verifying Security Access...
      </div>
    );
  }

  // Hide sidebar/header on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gold-primary/10 flex flex-col sticky top-0 h-screen shadow-sm z-20">
        <div className="p-8 border-b border-gold-primary/5">
          <Link href="/" className="text-xl font-premium tracking-[0.2em] font-bold gold-text-gradient">
            RS ADMIN
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-none transition-all group",
                  isActive 
                    ? "bg-gold-soft/30 text-gold-primary border-l-2 border-gold-primary pl-4" 
                    : "text-foreground/50 hover:bg-gold-soft/10 hover:text-gold-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(isActive ? "text-gold-primary" : "text-foreground/30 group-hover:text-gold-primary")} />
                  <span className="text-xs uppercase tracking-widest font-bold">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gold-primary/5 mt-auto">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logout();
              }
            }}
            className="flex items-center gap-3 text-foreground/40 hover:text-red-500 transition-colors p-3 w-full text-left group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <header className="h-20 bg-white border-b border-gold-primary/5 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-premium tracking-widest uppercase font-bold text-foreground/70">
              {menuItems.find(i => i.href === pathname)?.name || "Management"}
            </h2>
            
            <Link 
              href="/" 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gold-primary/20 text-[10px] uppercase tracking-widest font-bold text-gold-primary hover:bg-gold-soft/20 transition-all ml-4"
            >
              <ExternalLink size={12} />
              View Store
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">Boutique Admin</p>
              <p className="text-xs text-foreground/40">Ranjani</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-soft/50 border border-gold-primary/20 flex items-center justify-center font-premium font-bold text-gold-primary">
              R
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  );
}
