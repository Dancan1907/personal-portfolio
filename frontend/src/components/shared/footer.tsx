// frontend/src/components/shared/footer.tsx
"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

// Simple inline SVG icons for GitHub & LinkedIn
// (lucide-react removed brand/logo icons in recent versions)
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

// Social media links configuration
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Dancan1907",
    icon: GithubIcon,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/dancan-kalerwa-7a3741297/",
    icon: LinkedinIcon,
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
