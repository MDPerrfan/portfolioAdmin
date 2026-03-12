"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  HiOutlineFolderOpen,
  HiOutlineMail,
  HiOutlineEye,
  HiOutlineClock,
} from "react-icons/hi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// Stat Card 
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// Recent Activity Row 
function ActivityRow({ title, time, type }) {
  const colors = {
    project: "bg-orange-100 text-orange-600",
    message: "bg-blue-100 text-blue-600",
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colors[type]}`}>
          {type}
        </span>
        <span className="text-sm text-gray-700">{title}</span>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes] = await Promise.all([
          api.get("/projects"),
          api.get("/messages"),
        ]);

        const projects = projectsRes.data.projects;
        const messages = messagesRes.data.messages;
        const unread   = messagesRes.data.unreadCount;

        setStats({
          totalProjects: projects.length,
          totalMessages: messages.length,
          unreadMessages: unread,
          latestProject: projects[0]?.title ?? "No projects yet",
        });

        // Build chart data — projects added per month
        const monthMap = {};
        projects.forEach((p) => {
          const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
          monthMap[month] = (monthMap[month] || 0) + 1;
        });
        setChartData(
          Object.entries(monthMap).map(([month, count]) => ({ month, count }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Good day, Parves 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your portfolio.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={stats.totalProjects}
          icon={HiOutlineFolderOpen}
          color="#f97316"
          sub="Published on portfolio"
        />
        <StatCard
          label="Total Messages"
          value={stats.totalMessages}
          icon={HiOutlineMail}
          color="#3b82f6"
          sub={`${stats.unreadMessages} unread`}
        />
        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={HiOutlineEye}
          color="#8b5cf6"
          sub="Needs attention"
        />
        <StatCard
          label="Latest Project"
          value="—"
          icon={HiOutlineClock}
          color="#10b981"
          sub={stats.latestProject}
        />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Projects per month chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Projects Added by Month</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No project data yet
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Messages</h2>
          <div className="flex flex-col">
            {stats.totalMessages === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
            ) : (
              // We'll just show placeholder rows here — full list is in /messages
              <p className="text-sm text-gray-500">
                You have <span className="font-semibold text-gray-900">{stats.totalMessages}</span> messages,{" "}
                <span className="font-semibold text-orange-500">{stats.unreadMessages} unread</span>.
                <a href="/dashboard/messages" className="text-blue-500 hover:underline ml-2 text-sm">
                  View all →
                </a>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}