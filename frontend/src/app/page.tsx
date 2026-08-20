// ============================================
// HOME PAGE - Root Route
// ============================================
// This is the main landing page for the portfolio
// It displays the home page content to ALL visitors
// No authentication required - it's a public page

import HeroSection from "@/components/home/hero-section";
import FeaturedProjects from "@/components/home/featured-projects";
import SkillsPreview from "@/components/home/skills-preview";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Server Component - fetches data on the server
export default async function HomePage() {
  // ============================================
  // FETCH FEATURED PROJECTS
  // ============================================
  let featuredProjects = [];
  try {
    const response = await fetch(`${API_URL}/projects/featured`, {
      next: { revalidate: 0 }, // ← REPLACE cache: 'no-store' with this
    });
    if (response.ok) {
      featuredProjects = await response.json();
    } else {
      console.error("Failed to fetch featured projects:", response.status);
    }
  } catch (error) {
    console.error("Error fetching featured projects:", error);
  }

  // ============================================
  // FETCH SKILLS
  // ============================================
  let skills = [];
  try {
    const response = await fetch(`${API_URL}/skills`, {
      next: { revalidate: 0 }, // ← REPLACE cache: 'no-store' with this
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
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <SkillsPreview skills={skills} />
    </div>
  );
}
