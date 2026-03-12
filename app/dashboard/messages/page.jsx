"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  HiOutlineMail,
  HiOutlineMailOpen,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";

// ── Message Modal ───────────────────────────────────────────────────────────
function MessageModal({ message, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Sender info */}
        <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{message.name}</span>
            <span className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              })}
            </span>
          </div>
          <a
            href={`mailto:${message.email}`}
            className="text-sm text-orange-500 hover:underline"
          >
            {message.email}
          </a>
        </div>

        {/* Message body */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <a
            href={`mailto:${message.email}`}
            className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600
                       text-white text-sm font-semibold text-center transition"
          >
            Reply via Email
          </a>
          <button
            onClick={() => onDelete(message)}
            className="px-4 py-2.5 rounded-lg border border-red-100 text-red-500
                       hover:bg-red-50 text-sm font-medium transition"
          >
            <HiOutlineTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message Row ─────────────────────────────────────────────────────────────
function MessageRow({ message, onOpen, onDelete, onMarkRead }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer
                  hover:shadow-sm
                  ${message.read
                    ? "bg-white border-gray-200"
                    : "bg-orange-50 border-orange-200"
                  }`}
      onClick={() => onOpen(message)}
    >
      {/* Icon */}
      <div className={`mt-0.5 flex-shrink-0 ${message.read ? "text-gray-400" : "text-orange-500"}`}>
        {message.read
          ? <HiOutlineMailOpen size={18} />
          : <HiOutlineMail size={18} />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-sm font-semibold truncate
                           ${message.read ? "text-gray-700" : "text-gray-900"}`}>
            {message.name}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {new Date(message.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric",
            })}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{message.email}</p>
        <p className="text-sm text-gray-500 truncate mt-1">{message.message}</p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        onClick={(e) => e.stopPropagation()} // prevent row click
      >
        {!message.read && (
          <button
            onClick={() => onMarkRead(message._id)}
            className="text-xs text-gray-400 hover:text-gray-700 transition px-2 py-1
                       rounded-lg hover:bg-gray-100"
          >
            Mark read
          </button>
        )}
        <button
          onClick={() => onDelete(message)}
          className="text-gray-400 hover:text-red-500 transition p-1.5
                     rounded-lg hover:bg-red-50"
        >
          <HiOutlineTrash size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirm ──────────────────────────────────────────────────────────
function DeleteModal({ message, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">Delete Message</h2>
        <p className="text-sm text-gray-500 mb-6">
          Delete message from{" "}
          <span className="font-semibold text-gray-800">{message?.name}</span>?
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
                       text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600
                       disabled:bg-red-300 text-white text-sm font-semibold transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [filter, setFilter]         = useState("all"); // all | unread | read

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages");
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = async (message) => {
    setSelected(message);
    setShowModal(true);
    // Auto mark as read when opened
    if (!message.read) {
      try {
        await api.put(`/messages/${message._id}/read`);
        setMessages((prev) =>
          prev.map((m) => m._id === message._id ? { ...m, read: true } : m)
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => m._id === id ? { ...m, read: true } : m)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openDelete = (message) => {
    setSelected(message);
    setShowModal(false);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/messages/${selected._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== selected._id));
      setShowDelete(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // Filter messages
  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read")   return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0
              ? <span><span className="text-orange-500 font-semibold">{unreadCount} unread</span> — {messages.length} total</span>
              : `${messages.length} message${messages.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize
                          ${filter === f
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                          }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200
                                    h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20
                        flex flex-col items-center gap-3">
          <HiOutlineMailOpen size={40} className="text-gray-300" />
          <p className="text-gray-400 text-sm">
            {filter === "unread" ? "No unread messages" : "No messages yet"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((m) => (
            <MessageRow
              key={m._id}
              message={m}
              onOpen={openMessage}
              onDelete={openDelete}
              onMarkRead={markRead}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && selected && (
        <MessageModal
          message={selected}
          onClose={() => setShowModal(false)}
          onDelete={openDelete}
        />
      )}

      {showDelete && (
        <DeleteModal
          message={selected}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}