// ============================================
// HERO SECTION - Home Page Hero
// ============================================
// This component displays the main hero section on the home page
// It's a Server Component (no "use client" needed)
// Features:
// - Name and title (animated with typewriter effect)
// - Brief tagline
// - CTA buttons (View Projects, Contact)

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import TypewriterEffect from "@/components/home/typewriter-effect";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Greeting */}
        <p className="text-sm sm:text-base font-medium text-indigo-600 dark:text-indigo-400 mb-3 sm:mb-4">
          👋 Hello, I am
        </p>

        {/* Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          <TypewriterEffect
            text="Dancan Kalerwa"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
            delay={0.3}
          />
        </h1>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium mb-4 sm:mb-6">
          Full Stack Developer
        </h2>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10">
          Building beautiful, performant, and scalable web applications with
          modern technologies. Passionate about clean code and great user
          experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {/* Primary CTA - View Projects */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 text-sm sm:text-base"
          >
            View My Work
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Secondary CTA - Contact */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-sm sm:text-base"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Get in Touch
          </Link>
        </div>

        {/* Tech stack badges */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mr-2">
            Tech Stack:
          </span>
          {[
            "Next.js",
            "React",
            "NestJS",
            "TypeScript",
            "PostgreSQL",
            "Tailwind CSS",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
