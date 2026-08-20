// ============================================
// EXPERIENCE MANAGEMENT - Admin Dashboard
// ============================================
// This page allows admins to manage work experience (CRUD)
// Features:
// - List all experience entries in a table
// - Create new experience with form
// - Edit existing experience
// - Delete experience with confirmation
// - Toggle current position

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

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

// ============================================
// HELPERS
// ============================================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// ============================================
// EXPERIENCE MANAGEMENT COMPONENT
// ============================================

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
    responsibilities: "",
    technologies: "",
    achievements: "",
    order: "",
  });

  // ============================================
  // FETCH EXPERIENCE
  // ============================================

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/experience");
      setExperiences(response.data);
    } catch (err) {
      console.error("Error fetching experience:", err);
      setError("Failed to load experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // ============================================
  // CREATE / UPDATE EXPERIENCE
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      role: formData.role,
      organization: formData.organization,
      location: formData.location || undefined,
      startDate: formData.startDate,
      endDate: formData.isPresent ? undefined : formData.endDate || undefined,
      isPresent: formData.isPresent,
      description: formData.description || undefined,
      responsibilities: formData.responsibilities
        ? formData.responsibilities.split("\n").filter((s) => s.trim())
        : [],
      technologies: formData.technologies
        ? formData.technologies.split(",").map((s) => s.trim())
        : [],
      achievements: formData.achievements
        ? formData.achievements.split("\n").filter((s) => s.trim())
        : [],
      order: formData.order ? parseInt(formData.order) : 0,
    };

    try {
      if (editingExperience) {
        await api.put(`/experience/${editingExperience.id}`, payload);
      } else {
        await api.post("/experience", payload);
      }

      await fetchExperiences();
      closeModal();
    } catch (err) {
      console.error("Error saving experience:", err);
      alert("Failed to save experience. Please try again.");
    }
  };

  // ============================================
  // DELETE EXPERIENCE
  // ============================================

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) {
      return;
    }

    try {
      await api.delete(`/experience/${id}`);
      await fetchExperiences();
    } catch (err) {
      console.error("Error deleting experience:", err);
      alert("Failed to delete experience. Please try again.");
    }
  };

  // ============================================
  // MODAL HELPERS
  // ============================================

  const openCreateModal = () => {
    setEditingExperience(null);
    setFormData({
      role: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      responsibilities: "",
      technologies: "",
      achievements: "",
      order: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      role: experience.role,
      organization: experience.organization,
      location: experience.location || "",
      startDate: experience.startDate.split("T")[0],
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      isPresent: experience.isPresent,
      description: experience.description || "",
      responsibilities: experience.responsibilities?.join("\n") || "",
      technologies: experience.technologies?.join(", ") || "",
      achievements: experience.achievements?.join("\n") || "",
      order: experience.order?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, or remove work experience from your portfolio.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Loading experience...
          </p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No experience entries found.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Role / Organization
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date Range
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Technologies
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {experiences.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {exp.role}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.organization}
                        {exp.location && (
                          <span className="inline-flex items-center gap-1 ml-2 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(exp.startDate)} —{" "}
                        {exp.isPresent
                          ? "Present"
                          : exp.endDate
                            ? formatDate(exp.endDate)
                            : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exp.isPresent
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {exp.isPresent ? "Current" : "Past"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {exp.technologies?.slice(0, 3).join(", ")}
                      {exp.technologies && exp.technologies.length > 3 && "..."}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CREATE/EDIT MODAL */}
      {/* ============================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role & Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Senior Full Stack Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Tech Corp"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    disabled={formData.isPresent}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Current Position */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPresent}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      isPresent: e.target.checked,
                      endDate: e.target.checked ? "" : formData.endDate,
                    });
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  I currently work here
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Brief description of the role"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsibilities: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Architected microservices using NestJS&#10;Led frontend development with Next.js&#10;Mentored junior developers"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievements (one per line)
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) =>
                    setFormData({ ...formData, achievements: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Reduced load time by 40%&#10;Scaled to 10,000 concurrent users"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 0, 1, 2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingExperience ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
