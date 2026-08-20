// ============================================
// DASHBOARD HOME PAGE
// ============================================
// This page displays an overview of the portfolio stats
// Features:
// - Stats cards (projects, skills, messages, etc.)
// - Quick actions
// - Recent activity

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

// Type for stats data
type DashboardStats = {
  skills: number;
  projects: number;
  experience: number;
  education: number;
  messages: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    skills: 0,
    projects: 0,
    experience: 0,
    education: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all counts in parallel
        const [
          skillsRes,
          projectsRes,
          experienceRes,
          educationRes,
          messagesRes,
        ] = await Promise.all([
          api.get("/skills"),
          api.get("/projects"),
          api.get("/experience"),
          api.get("/education"),
          api.get("/contact"),
        ]);

        setStats({
          skills: skillsRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          experience: experienceRes.data?.length || 0,
          education: educationRes.data?.length || 0,
          messages: messagesRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stats cards configuration
  const statCards = [
    {
      title: "Skills",
      count: stats.skills,
      icon: Code2,
      href: "/dashboard/skills",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Projects",
      count: stats.projects,
      icon: FolderGit2,
      href: "/dashboard/projects",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Experience",
      count: stats.experience,
      icon: Briefcase,
      href: "/dashboard/experience",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Education",
      count: stats.education,
      icon: GraduationCap,
      href: "/dashboard/education",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Messages",
      count: stats.messages,
      icon: Mail,
      href: "/dashboard/messages",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || user?.email}!
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Logged in as {user?.role}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? "..." : card.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Link
            href="/dashboard/skills"
            className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            + Add Skill
          </Link>
          <Link
            href="/dashboard/projects"
            className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            + Add Project
          </Link>
          <Link
            href="/dashboard/experience"
            className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            + Add Experience
          </Link>
          <Link
            href="/dashboard/education"
            className="px-4 py-3 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            + Add Education
          </Link>
        </div>
      </div>
    </div>
  );
}
