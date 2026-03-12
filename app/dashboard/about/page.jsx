"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { HiOutlineSave, HiOutlineUser } from "react-icons/hi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

// ── Field ───────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, icon: Icon, multiline }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                     outline-none focus:border-orange-400 focus:ring-2
                     focus:ring-orange-100 transition resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                     outline-none focus:border-orange-400 focus:ring-2
                     focus:ring-orange-100 transition"
        />
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [form, setForm]       = useState({
    name:        "",
    title:       "",
    description: "",
    email:       "",
    phone:       "",
    location:    "",
    github:      "",
    linkedin:    "",
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  // Fetch existing about data
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/about");
        const a   = res.data.about;
        setForm({
          name:        a.name        ?? "",
          title:       a.title       ?? "",
          description: a.description ?? "",
          email:       a.email       ?? "",
          phone:       a.phone       ?? "",
          location:    a.location    ?? "",
          github:      a.github      ?? "",
          linkedin:    a.linkedin    ?? "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.name || !form.title) {
      setError("Name and title are required");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await api.put("/about", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200
                                  h-14 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">About</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          This info is displayed on your portfolio's about section.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700
                        text-sm rounded-lg px-4 py-3">
          ✓ Changes saved successfully
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
                        text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Identity ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5
                      flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <HiOutlineUser size={15} className="text-orange-500" />
          Identity
        </h2>
        <Field
          label="Full Name"
          value={form.name}
          onChange={set("name")}
          placeholder="Mohammed Parves"
        />
        <Field
          label="Title / Role"
          value={form.title}
          onChange={set("title")}
          placeholder="Full Stack MERN Developer"
        />
        <Field
          label="Bio"
          value={form.description}
          onChange={set("description")}
          placeholder="A short description about yourself..."
          multiline
        />
      </div>

      {/* ── Contact ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5
                      flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <HiOutlineMail size={15} className="text-orange-500" />
          Contact Info
        </h2>
        <Field
          label="Email"
          value={form.email}
          onChange={set("email")}
          placeholder="mdperrfan@gmail.com"
          icon={HiOutlineMail}
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={set("phone")}
          placeholder="01815638385"
          icon={HiOutlinePhone}
        />
        <Field
          label="Location"
          value={form.location}
          onChange={set("location")}
          placeholder="Chittagong, Bangladesh"
          icon={HiOutlineLocationMarker}
        />
      </div>

      {/* ── Social ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5
                      flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaGithub size={14} className="text-orange-500" />
          Social Links
        </h2>
        <Field
          label="GitHub URL"
          value={form.github}
          onChange={set("github")}
          placeholder="https://github.com/MDPerrfan"
          icon={FaGithub}
        />
        <Field
          label="LinkedIn URL"
          value={form.linkedin}
          onChange={set("linkedin")}
          placeholder="https://linkedin.com/in/mdperrfan"
          icon={FaLinkedin}
        />
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500
                     hover:bg-orange-600 disabled:bg-orange-300 text-white
                     text-sm font-semibold rounded-lg transition"
        >
          <HiOutlineSave size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
