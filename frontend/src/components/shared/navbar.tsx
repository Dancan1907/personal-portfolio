// ============================================
// NAVBAR COMPONENT - Main Navigation
// ============================================
// This component provides the main navigation bar for the portfolio
// Features:
// - Responsive design (desktop + mobile)
// - Active link highlighting
// - Dark/light mode toggle
// - Admin dashboard link (when logged in)
// - Glass-morphism styling

"use client"; // Required for client-side interactivity

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // To get current route
import { useAuth } from "@/providers/auth-provider";
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
// Each link has: name, href, and icon
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
  // State for mobile menu (open/closed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current path to highlight active link
  const pathname = usePathname();

  // Get user authentication state
  const { user } = useAuth();

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to close mobile menu (when a link is clicked)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"; // Home: exact match
    }
    return pathname.startsWith(href); // Other pages: starts with
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
          {/* Hidden on mobile, visible on medium screens and up */}
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
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" // Active style
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" // Inactive style
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Dashboard Link (only visible when logged in) */}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          {/* Visible on small screens, hidden on medium and up */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle on mobile */}
            <ThemeToggle />

            {/* Hamburger menu button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" /> // Close icon when open
              ) : (
                <Menu className="w-6 h-6" /> // Hamburger icon when closed
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE NAVIGATION DROPDOWN ===== */}
      {/* Shows when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="px-4 py-3 space-y-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu} // Close menu when link is clicked
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

            {/* Admin Dashboard Link on mobile */}
            {user && (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
