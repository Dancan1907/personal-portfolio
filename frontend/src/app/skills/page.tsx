// ============================================
// SKILLS PAGE - Server Component
// ============================================
// This page displays all technical skills grouped by category.
// Features:
// - Fetches skills from the backend API
// - Groups skills by category
// - Displays Lucide icons for skills (when available)
// - Shows proficiency levels with progress bars
// - Supports light/dark mode
// - Responsive grid layout

import * as Icons from "lucide-react";

// ============================================
// API CONFIGURATION
// ============================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// ============================================
// TYPES
// ============================================

type Skill = {
  id: string;
  category: string;
  name: string;
  icon: string | null;
  proficiency: number | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
};

// ============================================
// ICON MAPPING
// ============================================

// Map skill icon names to Lucide icon components
// These names should match what's stored in your database
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // ===== FRONTEND =====
  React: Icons.React,
  Nextjs: Icons.Nextjs,
  Vue: Icons.Vue,
  Angular: Icons.Angular,
  Svelte: Icons.Svelte,
  Tailwind: Icons.Palette,
  "Tailwind CSS": Icons.Palette,
  CSS: Icons.Palette,
  HTML: Icons.FileCode2,
  TypeScript: Icons.FileCode2,
  JavaScript: Icons.FileCode2,

  // ===== BACKEND =====
  Nestjs: Icons.Server,
  Nodejs: Icons.Server,
  "Node.js": Icons.Server,
  Express: Icons.Server,
  Django: Icons.Server,
  Flask: Icons.Server,
  Spring: Icons.Server,
  Laravel: Icons.Server,
  Prisma: Icons.Database,
  Api: Icons.Zap,
  ShieldCheck: Icons.Shield,

  // ===== DATABASE =====
  PostgreSQL: Icons.Database,
  Postgresql: Icons.Database,
  MySQL: Icons.Database,
  MongoDB: Icons.Database,
  Redis: Icons.Database,
  SQLite: Icons.Database,

  // ===== DEVOPS =====
  Docker: Icons.Box,
  Kubernetes: Icons.Box,
  AWS: Icons.Cloud,
  Azure: Icons.Cloud,
  GCP: Icons.Cloud,
  Github: Icons.Github,
  Git: Icons.GitBranch,
  "CI/CD": Icons.Workflow,
  Jenkins: Icons.Workflow,

  // ===== TOOLS =====
  VSCode: Icons.Code2,
  Figma: Icons.PenTool,
  Slack: Icons.MessageSquare,
  Postman: Icons.Bug,
  Linux: Icons.Terminal,
  Nginx: Icons.Server,
};

// ============================================
// HELPERS
// ============================================

/**
 * Gets the Lucide icon component for a skill
 * Returns null if no valid icon mapping exists
 */
function getSkillIcon(
  iconName: string | null,
): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

/**
 * Groups skills by category and sorts
 * skills within each category by their order.
 */
function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );
}

/**
 * Returns the Tailwind background color
 * based on the proficiency percentage.
 */
function getProficiencyColor(level: number | null): string {
  if (level === null) {
    return "bg-gray-300 dark:bg-gray-600";
  }
  if (level >= 80) {
    return "bg-green-500";
  }
  if (level >= 60) {
    return "bg-blue-500";
  }
  if (level >= 40) {
    return "bg-yellow-500";
  }
  return "bg-gray-400";
}

/**
 * Sorts skills by their configured order.
 */
function sortSkills(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => {
    if (a.order === null && b.order === null) {
      return a.name.localeCompare(b.name);
    }
    if (a.order === null) {
      return 1;
    }
    if (b.order === null) {
      return -1;
    }
    return a.order - b.order;
  });
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function SkillsPage() {
  // ============================================
  // FETCH SKILLS
  // ============================================

  let skills: Skill[] = [];
  let error = false;

  try {
    const response = await fetch(`${API_URL}/skills`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch skills:",
        response.status,
        response.statusText,
      );
      error = true;
    } else {
      const data = await response.json();
      if (Array.isArray(data)) {
        skills = sortSkills(data);
      } else {
        console.error("Invalid skills API response:", data);
        error = true;
      }
    }
  } catch (err) {
    console.error("Error fetching skills:", err);
    error = true;
  }

  // ============================================
  // GROUP SKILLS
  // ============================================

  const groupedSkills = groupSkillsByCategory(skills);
  const categories = Object.keys(groupedSkills).sort((a, b) =>
    a.localeCompare(b),
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ============================================ */}
        {/* PAGE HEADER */}
        {/* ============================================ */}

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            My Skills
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            Technologies and tools I work with, organized by category.
          </p>
        </div>

        {/* ============================================ */}
        {/* ERROR STATE */}
        {/* ============================================ */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load skills. Please try again later.
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* EMPTY STATE */}
        {/* ============================================ */}

        {!error && skills.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              No skills available yet.
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* SKILLS GRID */}
        {/* ============================================ */}

        {!error && skills.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((category) => {
              const categorySkills = groupedSkills[category];

              return (
                <section
                  key={category}
                  className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80 sm:p-8"
                >
                  {/* Category Title */}
                  <h2 className="mb-5 border-b border-gray-200/50 pb-3 text-xl font-bold text-gray-900 dark:border-gray-700/50 dark:text-white">
                    {category}
                  </h2>

                  {/* Skills */}
                  <div className="space-y-5">
                    {categorySkills.map((skill) => {
                      const IconComponent = getSkillIcon(skill.icon);

                      return (
                        <div key={skill.id} className="flex flex-col gap-2">
                          {/* Skill Name + Icon + Proficiency */}
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {/* Show Lucide icon ONLY if a valid mapping exists */}
                              {IconComponent && (
                                <IconComponent className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                              )}
                              {skill.name}
                            </span>

                            {skill.proficiency !== null && (
                              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                                {skill.proficiency}%
                              </span>
                            )}
                          </div>

                          {/* Proficiency Bar */}
                          {skill.proficiency !== null && (
                            <div
                              className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                              role="progressbar"
                              aria-valuenow={skill.proficiency}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${skill.name} proficiency`}
                            >
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getProficiencyColor(
                                  skill.proficiency,
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    Math.max(skill.proficiency, 0),
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
