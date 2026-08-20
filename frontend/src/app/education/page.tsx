// ============================================
// EDUCATION PAGE - Server Component
// ============================================
// This page displays education history in a timeline format
// Features:
// - Fetches education from the API
// - Displays in chronological order (newest first)
// - Shows institution, degree, field, dates
// - Highlights current studies

import { GraduationCap, Calendar, MapPin } from "lucide-react";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for education data from the API
type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string | null;
  coursework: string[] | null;
  achievements: string[] | null;
  gpa: string | null;
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
function getDateRange(education: Education): string {
  const start = formatDate(education.startDate);
  const end = education.isPresent
    ? "Present"
    : education.endDate
      ? formatDate(education.endDate)
      : "";
  return `${start} — ${end}`;
}

export default async function EducationPage() {
  // ============================================
  // FETCH EDUCATION
  // ============================================
  let educations: Education[] = [];
  let error = false;

  try {
    const response = await fetch(`${API_URL}/education`);

    if (response.ok) {
      const data = await response.json();
      console.log("📊 Education fetched:", data.length);
      educations = data;
    } else {
      console.error("Failed to fetch education:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching education:", err);
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
            Education
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My academic journey and qualifications.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load education. Please try again later.
            </p>
          </div>
        )}

        {/* No Education State */}
        {!error && educations.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-gray-500 dark:text-gray-400">
              No education entries available yet.
            </p>
          </div>
        )}

        {/* Education Timeline */}
        {!error && educations.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {educations.map((education) => (
              <div
                key={education.id}
                className="relative pl-12 md:pl-16 pb-10 last:pb-0"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    education.isPresent
                      ? "bg-green-500 border-green-500 dark:border-green-400"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <GraduationCap
                    className={`w-4 h-4 ${
                      education.isPresent
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>

                {/* Education Card */}
                <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8">
                  {/* Institution and Degree */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {education.institution}
                  </h2>
                  <h3 className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
                    {education.degree}
                    {education.field && ` in ${education.field}`}
                  </h3>

                  {/* Location and Date */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {education.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {education.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {getDateRange(education)}
                      {education.isPresent && (
                        <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Current
                        </span>
                      )}
                    </span>
                    {education.gpa && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          GPA:
                        </span>
                        {education.gpa}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {education.description && (
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      {education.description}
                    </p>
                  )}

                  {/* Coursework */}
                  {education.coursework && education.coursework.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Relevant Coursework
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {education.coursework.map((course) => (
                          <span
                            key={course}
                            className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {education.achievements &&
                    education.achievements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Achievements
                        </h4>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {education.achievements.map((item) => (
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
