// ============================================
// ABOUT PAGE - Server Component
// ============================================
// This page displays the portfolio owner's professional information
// Features:
// - Profile information (name, title, bio, location)
// - Social links (GitHub, LinkedIn, Twitter, Email)
// - Stats (experience, projects, skills)
// - Fetches data from the backend API

import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  FolderGit2,
  Code2,
} from "lucide-react";

// Base URL for API calls
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Type for profile data from the API
type Profile = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  email: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
};

export default async function AboutPage() {
  // ============================================
  // FETCH PROFILE DATA
  // ============================================
  let profile: Profile | null = null;
  let error = false;

  try {
    // Get the user ID - we'll use a public endpoint
    // For now, we'll fetch from a known user ID
    // In production, you might want to fetch by username or slug
    const userId =
      process.env.NEXT_PUBLIC_USER_ID || "cmsm08fqq00007fyfmzib4zk5";
    const response = await fetch(`${API_URL}/profile/public/${userId}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      profile = await response.json();
    } else {
      console.error("Failed to fetch profile:", response.status);
      error = true;
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    error = true;
  }

  // ============================================
  // RENDER THE PAGE
  // ============================================
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4">
          About Me
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Learn more about my background, skills, and what drives me.
        </p>

        {/* Profile Content */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              Failed to load profile information. Please try again later.
            </p>
          </div>
        ) : profile ? (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-500/20"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </h2>
                {profile.title && (
                  <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                    {profile.title}
                  </p>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      About Me
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Briefcase className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    5+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <FolderGit2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    15+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Code2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    10+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Technologies
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Mail className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    50+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No profile information available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
