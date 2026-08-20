// ============================================
// EXPERIENCE PAGE - Server Component
// ============================================
// This page displays work experience in a timeline format
// Features:
// - Fetches experience from the API
// - Displays in chronological order (newest first)
// - Shows role, company, dates, description
// - Highlights current position

import { Briefcase, Calendar, MapPin } from "lucide-react";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for experience data from the API
type Experience = {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string | null;
  responsibilities: string[] | null;
  technologies: string[] | null;
  achievements: string[] | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
};

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Helper to get date range string
function getDateRange(experience: Experience): string {
  const start = formatDate(experience.startDate);
  const end = experience.isPresent
    ? "Present"
    : experience.endDate
      ? formatDate(experience.endDate)
      : "";
  return `${start} — ${end}`;
}

export default async function ExperiencePage() {
  // ============================================
  // FETCH EXPERIENCE
  // ============================================
  let experiences: Experience[] = [];
  let error = false;

  try {
    const response = await fetch(`${API_URL}/experience`);

    if (response.ok) {
      const data = await response.json();
      console.log("📊 Experience fetched:", data.length);
      experiences = data;
    } else {
      console.error("Failed to fetch experience:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching experience:", err);
    error = true;
  }

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Experience
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My professional journey and work experience.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load experience. Please try again later.
            </p>
          </div>
        )}

        {/* No Experience State */}
        {!error && experiences.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              No experience entries available yet.
            </p>
          </div>
        )}

        {/* Experience Timeline */}
        {!error && experiences.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="relative pl-12 md:pl-16 pb-10 last:pb-0"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    experience.isPresent
                      ? "bg-green-500 border-green-500 dark:border-green-400"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <Briefcase
                    className={`w-4 h-4 ${
                      experience.isPresent
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>

                {/* Experience Card */}
                <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
                  {/* Role and Company */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {experience.role}
                  </h2>
                  <h3 className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
                    {experience.organization}
                  </h3>

                  {/* Location and Date */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {experience.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {getDateRange(experience)}
                      {experience.isPresent && (
                        <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Current
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Description */}
                  {experience.description && (
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      {experience.description}
                    </p>
                  )}

                  {/* Responsibilities */}
                  {experience.responsibilities &&
                    experience.responsibilities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Responsibilities
                        </h4>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {experience.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Technologies */}
                  {experience.technologies &&
                    experience.technologies.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Technologies
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Achievements */}
                  {experience.achievements &&
                    experience.achievements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Key Achievements
                        </h4>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {experience.achievements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
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
