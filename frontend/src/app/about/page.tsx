// ============================================
// ABOUT PAGE - Server Component (Fixed)
// ============================================

import { MapPin, Briefcase, FolderGit2, Code2, Mail } from "lucide-react";

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

// Helper function to render social link
function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      {children}
    </a>
  );
}

export default async function AboutPage() {
  // ============================================
  // FETCH PROFILE DATA
  // ============================================
  let profile: Profile | null = null;
  let error = false;

  try {
    // YOUR USER ID FROM THE DATABASE
    const userId = "cmsm5wx01000014nu3hanmkp9"; // Your actual user ID
    const response = await fetch(`${API_URL}/profile/public/${userId}`, {
      next: { revalidate: 3600 },
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4">
          About Me
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Learn more about my background, skills, and what drives me.
        </p>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              Failed to load profile information. Please try again later.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Make sure you have created a profile in the database.
            </p>
          </div>
        ) : profile ? (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Avatar Section */}
              <div className="flex-shrink-0 flex justify-center md:block">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-500/20"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold mx-auto md:mx-0">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </h2>
                {profile.title && (
                  <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                    {profile.title}
                  </p>
                )}
                {profile.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

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
                <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                  {profile.githubUrl && (
                    <SocialLink href={profile.githubUrl}>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                      </svg>
                    </SocialLink>
                  )}
                  {profile.linkedinUrl && (
                    <SocialLink href={profile.linkedinUrl}>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
                      </svg>
                    </SocialLink>
                  )}
                  {profile.email && (
                    <SocialLink href={`mailto:${profile.email}`}>
                      <Mail className="w-5 h-5" />
                    </SocialLink>
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
