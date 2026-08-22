// ============================================
// PROJECT DETAIL PAGE - Server Component
// ============================================
// This page displays a single project with all its details
// Dynamic route: /projects/[slug]
// Features:
// - Fetches a single project by slug
// - Displays full project information
// - Shows tech stack and features
// - Handles 404 if project not found

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react"; // ← REMOVED Github

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for project data from the API
type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  challenge: string | null;
  lessons: string | null;
  techStack: string[] | null;
  features: string[] | null;
  demoUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

// Inline SVG for GitHub (lucide-react removed this icon)
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // ============================================
  // FETCH PROJECT BY SLUG
  // ============================================
  let project: Project | null = null;
  let error = false;

  try {
    const response = await fetch(`${API_URL}/projects/slug/${params.slug}`);

    if (response.ok) {
      project = await response.json();
    } else if (response.status === 404) {
      notFound();
    } else {
      console.error("Failed to fetch project:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching project:", err);
    error = true;
  }

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load project. Please try again later.
            </p>
          </div>
        )}

        {project && (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>

            {project.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {project.description}
              </p>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Key Features
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.problem && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Problem
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Solution
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.solution}
                </p>
              </div>
            )}

            {project.challenge && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Challenge
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.lessons && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Lessons Learned
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.lessons}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Live Demo
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
