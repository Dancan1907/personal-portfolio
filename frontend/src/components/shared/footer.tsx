// frontend/src/components/shared/footer.tsx
// ============================================
// FOOTER COMPONENT - Page Footer
// ============================================

"use client"; // ← ADD THIS - Required for client-side interactivity

import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

// Social media links configuration
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Dancan1907",
    icon: Github,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/dancan-kalerwa-7a3741297/",
    icon: Linkedin,
    color: "hover:text-blue-600 dark:hover:text-blue-400",
  },
  {
    name: "Email",
    href: "mailto:dancankalerwa@gmail.com",
    icon: Mail,
    color: "hover:text-red-500 dark:hover:text-red-400",
  },
];

// Quick navigation links
const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Dancan Kalerwa
              </span>
              <span className="text-gray-600 dark:text-gray-400"> | </span>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                Portfolio
              </span>
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Full-stack developer building amazing web applications with modern
              technologies. Passionate about clean code and great user
              experiences.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="mt-3 flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                      text-gray-600 dark:text-gray-400 
                      transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700
                      ${link.color}
                    `}
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Dancan Kalerwa. All rights reserved.
            <span className="block sm:inline sm:ml-2">
              Built with Next.js, NestJS, and Tailwind CSS.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
