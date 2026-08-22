// frontend/src/components/shared/navbar.tsx
// ============================================
// NAVBAR COMPONENT - Main Navigation
// ============================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import {
  Menu,
  X,
  Home,
  User,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Mail,
  LayoutDashboard,
} from "lucide-react";

// Define the navigation links array
const navigationLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Skills", href: "/skills", icon: Code2 },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Education", href: "/education", icon: GraduationCap },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminRevealed, setAdminRevealed] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  // ============================================
  // DOUBLE-CLICK LOGO TO REVEAL ADMIN LINK
  // ============================================
  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }

    if (clickCount + 1 === 2) {
      setAdminRevealed(true);
      setClickCount(0);

      const timeout = setTimeout(() => {
        setAdminRevealed(false);
      }, 10000);
      setClickTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setClickCount(0);
      }, 500);
      setClickTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name - Double Click to reveal admin link */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none"
            title="Double-click to reveal admin access"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Dancan
            </span>
            <span className="text-gray-600 dark:text-gray-400">|</span>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
              Portfolio
            </span>
          </Link>

          {/* ===== DESKTOP NAVIGATION ===== */}
          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(link.href)
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}

            {/* ===== ADMIN DASHBOARD LINK - Only visible when revealed ===== */}
            {adminRevealed && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 animate-pulse"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            {/* Admin link on mobile (when revealed) */}
            {adminRevealed && (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE NAVIGATION DROPDOWN ===== */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="px-4 py-3 space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(link.href)
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Dashboard Link on mobile (when revealed) */}
            {adminRevealed && (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <LayoutDashboard className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
