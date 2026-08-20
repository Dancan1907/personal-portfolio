// ============================================
// MESSAGES MANAGEMENT - Admin Dashboard
// ============================================
// This page allows admins to view and manage contact messages
// Features:
// - List all messages in a table
// - Mark messages as read/unread
// - Mark messages as replied
// - View message details in a modal
// - Delete message with confirmation
// - Unread count badge

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Mail,
  MailOpen,
  CheckCheck,
  Trash2,
  Eye,
  X,
  Reply,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  replied: boolean;
  repliedAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

// ============================================
// HELPERS
// ============================================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// MESSAGES MANAGEMENT COMPONENT
// ============================================

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ============================================
  // FETCH MESSAGES
  // ============================================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/contact");
      setMessages(response.data);

      // Calculate unread count
      const unread = response.data.filter((m: Message) => !m.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ============================================
  // MARK AS READ
  // ============================================

  const markAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already read

    try {
      await api.put(`/contact/${id}`, { isRead: true });
      await fetchMessages();
    } catch (err) {
      console.error("Error marking message as read:", err);
      alert("Failed to update message status.");
    }
  };

  // ============================================
  // MARK AS REPLIED
  // ============================================

  const markAsReplied = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/contact/${id}`, { replied: !currentStatus });
      await fetchMessages();
    } catch (err) {
      console.error("Error marking message as replied:", err);
      alert("Failed to update message status.");
    }
  };

  // ============================================
  // DELETE MESSAGE
  // ============================================

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);
      await fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  // ============================================
  // VIEW MESSAGE DETAILS
  // ============================================

  const openDetailModal = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailModalOpen(true);
    // Mark as read when viewed
    if (!message.isRead) {
      markAsRead(message.id, false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMessage(null);
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
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage messages from your contact form.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-full">
            <Mail className="w-4 h-4" />
            {unreadCount} unread
          </span>
        )}
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
            Loading messages...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Messages from your contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !message.isRead
                        ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {message.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {message.subject || "(no subject)"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!message.isRead && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            <Mail className="w-3 h-3" />
                            New
                          </span>
                        )}
                        {message.isRead && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                            <MailOpen className="w-3 h-3" />
                            Read
                          </span>
                        )}
                        {message.replied && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            <Reply className="w-3 h-3" />
                            Replied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailModal(message)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            markAsReplied(message.id, message.replied)
                          }
                          className={`p-1.5 transition-colors ${
                            message.replied
                              ? "text-green-600 hover:text-green-700 dark:text-green-400"
                              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          }`}
                          aria-label="Toggle replied"
                          title={
                            message.replied
                              ? "Mark as not replied"
                              : "Mark as replied"
                          }
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
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
      {/* MESSAGE DETAIL MODAL */}
      {/* ============================================ */}
      {isDetailModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Message from {selectedMessage.name}
              </h2>
              <button
                onClick={closeDetailModal}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMessage.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subject
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedMessage.subject || "(no subject)"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Message
                </p>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                    selectedMessage.isRead
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {selectedMessage.isRead ? "Read" : "Unread"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                    selectedMessage.replied
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {selectedMessage.replied ? "Replied" : "Not replied"}
                </span>
              </div>

              {selectedMessage.ipAddress && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  IP: {selectedMessage.ipAddress}
                  {selectedMessage.userAgent && (
                    <span className="ml-4">
                      User Agent: {selectedMessage.userAgent}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  <Reply className="w-4 h-4 inline mr-2" />
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    markAsReplied(selectedMessage.id, selectedMessage.replied);
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4 inline mr-2" />
                  {selectedMessage.replied
                    ? "Mark as not replied"
                    : "Mark as replied"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
