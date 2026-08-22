"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// ✅ Completely disable SSR for the entire page
const HeroSection = dynamic(() => import("@/components/home/hero-section"), {
  ssr: false,
});

const FeaturedProjects = dynamic(
  () => import("@/components/home/featured-projects"),
  { ssr: false },
);

const SkillsPreview = dynamic(
  () => import("@/components/home/skills-preview"),
  { ssr: false },
);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchData() {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          fetch(`${API_URL}/projects/featured`),
          fetch(`${API_URL}/skills`),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setFeaturedProjects(projectsData);
        }

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mounted]);

  // ✅ Show nothing during SSR to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <SkillsPreview skills={skills} />
    </div>
  );
}
