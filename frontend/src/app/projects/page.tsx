// ============================================
// PROJECTS PAGE - Server Component
// ============================================
// This page displays all published portfolio projects
// Features:
// - Fetches projects from the API
// - Displays in a responsive grid
// - Shows project cards with title, description, tech stack
// - Links to individual project pages

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for project data from the API
type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  techStack: string[] | null;
  demoUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export default async function ProjectsPage() {
  // ============================================
  // FETCH PROJECTS
  // ============================================
  let projects: Project[] = [];
  let error = false;

  try {
    // ✅ REMOVED cache: "no-store" - using default fetch behavior
    const response = await fetch(`${API_URL}/projects`);

    if (response.ok) {
      projects = await response.json();
    } else {
      console.error("Failed to fetch projects:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching projects:", err);
    error = true;
  }

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of applications and systems I&apos;ve built.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load projects. Please try again later.
            </p>
          </div>
        )}

        {/* No Projects State */}
        {!error && projects.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              No projects available yet. Check back soon!
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col"
              >
                {/* Project Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h2>

                {/* Project Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                  {project.description || "No description available."}
                </p>

                {/* Tech Stack Badges */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    View Details
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-auto"
                    >
                      <Github className="w-4 h-4" />
                      Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
