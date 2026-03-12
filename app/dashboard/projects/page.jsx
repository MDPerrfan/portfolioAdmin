"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExternalLink,
  HiOutlineX,
  HiOutlineFolderOpen
} from "react-icons/hi";
import { DiGithubBadge } from "react-icons/di";

// Empty Form State 
const EMPTY_FORM = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
};

//Project Form Modal 
function ProjectModal({ form, setForm, onSubmit, onClose, loading, isEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="My Awesome Project"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                         outline-none focus:border-orange-400 focus:ring-2
                         focus:ring-orange-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short description of what this project does..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                         outline-none focus:border-orange-400 focus:ring-2
                         focus:ring-orange-100 transition resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">GitHub URL</label>
            <input
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/MDPerrfan/project"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                         outline-none focus:border-orange-400 focus:ring-2
                         focus:ring-orange-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Live URL</label>
            <input
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://myproject.vercel.app"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm
                         outline-none focus:border-orange-400 focus:ring-2
                         focus:ring-orange-100 transition"
            />
            {form.liveUrl && (
              <p className="text-xs text-gray-400">
                Screenshot preview will be auto-generated from this URL
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
                       text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600
                       disabled:bg-orange-300 text-white text-sm font-semibold transition"
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

//  Delete Confirm Modal 
function DeleteModal({ project, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">Delete Project</h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{project?.title}</span>?
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

//  Project Card 
function ProjectCard({ project, onEdit, onDelete }) {
  const screenshot = project.liveUrl
    ? `https://api.microlink.io/screenshot?url=${encodeURIComponent(project.liveUrl)}&screenshot=true&meta=false&embed=screenshot.url`
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden
                    hover:shadow-md transition-shadow">
      {/* Screenshot */}
      <div className="h-36 bg-gray-100 overflow-hidden">
        {screenshot ? (
          <img
            src={screenshot}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No preview
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex gap-2 mb-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500
                         hover:text-gray-900 transition"
            >
              <DiGithubBadge size={14} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500
                         hover:text-orange-500 transition"
            >
              <HiOutlineExternalLink size={13} /> Live
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                       rounded-lg border border-gray-200 text-xs font-medium
                       text-gray-600 hover:bg-gray-50 transition"
          >
            <HiOutlinePencil size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(project)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2
                       rounded-lg border border-red-100 text-xs font-medium
                       text-red-500 hover:bg-red-50 transition"
          >
            <HiOutlineTrash size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

//  Main Page
export default function ProjectsPage() {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [selectedProject, setSelected] = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Open add modal
  const openAdd = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (project) => {
    setSelected(project);
    setForm({
      title:       project.title,
      description: project.description,
      githubUrl:   project.githubUrl,
      liveUrl:     project.liveUrl,
    });
    setError("");
    setShowModal(true);
  };

  // Open delete modal
  const openDelete = (project) => {
    setSelected(project);
    setShowDelete(true);
  };

  // Submit add or edit
  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      setError("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      if (selectedProject) {
        await api.put(`/projects/${selectedProject._id}`, form);
      } else {
        await api.post("/projects", form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/projects/${selectedProject._id}`);
      setShowDelete(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500
                     hover:bg-orange-600 text-white text-sm font-semibold
                     rounded-lg transition"
        >
          <HiOutlinePlus size={16} />
          Add Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                        rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200
                                    h-64 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20
                        flex flex-col items-center gap-3">
          <HiOutlineFolderOpen size={40} className="text-gray-300" />
          <p className="text-gray-400 text-sm">No projects yet</p>
          <button
            onClick={openAdd}
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            Add your first project →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ProjectModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          loading={submitting}
          isEdit={!!selectedProject}
        />
      )}

      {showDelete && (
        <DeleteModal
          project={selectedProject}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          loading={submitting}
        />
      )}
    </div>
  );
}