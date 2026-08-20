// ============================================
// SKILLS PAGE - Server Component
// ============================================
// This page displays all technical skills grouped by category
// Features:
// - Fetches skills from the API
// - Groups by category (Frontend, Backend, Database, etc.)
// - Displays skills with proficiency levels
// - Clean, organized grid layout

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for skill data from the API
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

// Group skills by category
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

// Helper to get proficiency color
function getProficiencyColor(level: number | null): string {
  if (!level) return "bg-gray-200 dark:bg-gray-700";
  if (level >= 80) return "bg-green-500";
  if (level >= 60) return "bg-blue-500";
  if (level >= 40) return "bg-yellow-500";
  return "bg-gray-400";
}

export default async function SkillsPage() {
  // ============================================
  // FETCH SKILLS
  // ============================================
  let skills: Skill[] = [];
  let error = false;

  try {
    const response = await fetch(`${API_URL}/skills`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      skills = await response.json();
    } else {
      console.error("Failed to fetch skills:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching skills:", err);
    error = true;
  }

  // Group skills by category
  const groupedSkills = groupSkillsByCategory(skills);
  const categories = Object.keys(groupedSkills).sort();

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Skills
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with, organized by category.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              Failed to load skills. Please try again later.
            </p>
          </div>
        )}

        {/* No Skills State */}
        {!error && skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No skills available. Add some in the admin dashboard.
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {!error && skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const categorySkills = groupedSkills[category];
              return (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
                >
                  {/* Category Title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                    {category}
                  </h2>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {skill.icon && (
                              <span className="mr-2">{skill.icon}</span>
                            )}
                            {skill.name}
                          </span>
                          {skill.proficiency && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>
                        {skill.proficiency && (
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProficiencyColor(skill.proficiency)}`}
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
