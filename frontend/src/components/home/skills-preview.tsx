// ============================================
// SKILLS PREVIEW - Home Page Section
// ============================================
// This component displays a preview of skills on the home page
// It's a Server Component - receives data as props from the parent
// Features:
// - Skills grouped by category
// - Shows top 3-4 skills per category
// - Link to view all skills

import Link from "next/link";

// Type definition for a skill
// Matches the backend SkillResponseDto
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

// Props for the component
interface SkillsPreviewProps {
  skills: Skill[];
}

export default function SkillsPreview({ skills }: SkillsPreviewProps) {
  // If no skills, don't render the section
  if (!skills || skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Get category names, sorted alphabetically
  const categories = Object.keys(groupedSkills).sort();

  // Only show top categories (max 4)
  const topCategories = categories.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            My Skills
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with.
          </p>
        </div>

        {/* Skills Grid - By Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {topCategories.map((category) => {
            const categorySkills = groupedSkills[category].slice(0, 5); // Max 5 skills per category
            return (
              <div
                key={category}
                className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
              >
                {/* Category Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {category}
                </h3>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600/50"
                    >
                      {skill.icon && (
                        <span className="mr-1.5">{skill.icon}</span>
                      )}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Skills Link */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            View All Skills
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
