// frontend/src/app/page.tsx
// ============================================
// HOME PAGE - Server Component
// ============================================
// This is the main landing page for the portfolio
// Features:
// - Hero section with typewriter effect
// - Featured projects with scroll animations
// - Skills preview with scroll animations

import HeroSection from "@/components/home/hero-section";
import FeaturedProjects from "@/components/home/featured-projects";
import SkillsPreview from "@/components/home/skills-preview";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default async function HomePage() {
  // ============================================
  // FETCH FEATURED PROJECTS
  // ============================================
  let featuredProjects = [];
  try {
    const response = await fetch(`${API_URL}/projects/featured`, {
      cache: "no-store",
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

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <SkillsPreview skills={skills} />
    </div>
  );
}
