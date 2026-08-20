// ============================================
// HOME PAGE - Server Component
// ============================================
// This page is the main landing page for the portfolio
// It fetches data on the server and renders it statically
// Features:
// - Hero section (static content)
// - Featured projects (fetched from API)
// - Skills preview (fetched from API)

// Since this is a Server Component, we can use async/await directly
// No "use client" directive needed!

import HeroSection from "@/components/home/hero-section";
import FeaturedProjects from "@/components/home/featured-projects";
import SkillsPreview from "@/components/home/skills-preview";

// Define the base URL for API calls
// NEXT_PUBLIC_API_URL is set in .env.local
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Server Component - can use async/await
export default async function HomePage() {
  // ============================================
  // FETCH FEATURED PROJECTS
  // ============================================
  // We use fetch with cache: 'no-store' to always get fresh data
  // In production, you might want to use revalidation instead
  let featuredProjects = [];
  try {
    const response = await fetch(`${API_URL}/projects/featured`, {
      cache: "no-store", // Don't cache - get fresh data on each request
      // In production, consider using: next: { revalidate: 3600 } (1 hour)
    });
    if (response.ok) {
      featuredProjects = await response.json();
    } else {
      console.error("Failed to fetch featured projects:", response.status);
    }
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    // Fallback to empty array - page still renders
  }

  // ============================================
  // FETCH SKILLS
  // ============================================
  // Get skills for the preview section
  let skills = [];
  try {
    const response = await fetch(`${API_URL}/skills`, {
      cache: "no-store",
    });
    if (response.ok) {
      skills = await response.json();
    } else {
      console.error("Failed to fetch skills:", response.status);
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
  }

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen">
      {/* Hero Section - Static content */}
      <HeroSection />

      {/* Featured Projects - Dynamic content from API */}
      <FeaturedProjects projects={featuredProjects} />

      {/* Skills Preview - Dynamic content from API */}
      <SkillsPreview skills={skills} />
    </div>
  );
}
