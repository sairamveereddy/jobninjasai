"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const navItems = [
  { name: "Plans", path: "/" },
  { name: "Prep", path: "/prep" },
  { name: "Profile", path: "/profile" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "Schedule", path: "/schedule" },
  { name: "Results", path: "/results" },
  { name: "Leaderboard", path: "/leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50, 
      padding: "1.5rem 2rem", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      background: "rgba(10, 10, 12, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--glass-border)"
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
        <div style={{ background: "var(--primary)", padding: "0.5rem", borderRadius: "10px" }}>
          <Zap color="white" size={20} fill="white" />
        </div>
        <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", letterSpacing: "-0.5px" }}>
          Job<span style={{ color: "var(--primary)" }}>Ninjas</span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: "2rem" }}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            style={{ 
              textDecoration: "none", 
              fontSize: "0.9rem", 
              fontWeight: "500", 
              color: pathname === item.path ? "var(--primary)" : "#94a3b8",
              transition: "color 0.2s"
            }}
          >
            {item.name}
            {pathname === item.path && (
              <motion.div 
                layoutId="nav-underline" 
                style={{ height: "2px", background: "var(--primary)", marginTop: "4px" }} 
              />
            )}
          </Link>
        ))}
      </div>

      <button className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
        Login
      </button>
    </nav>
  );
}
