"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineFolderOpen,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";

const NAV = [
  { label: "Overview",  href: "/dashboard",          icon: HiOutlineHome },
  { label: "Projects",  href: "/dashboard/projects",  icon: HiOutlineFolderOpen },
  { label: "Messages",  href: "/dashboard/messages",  icon: HiOutlineMail },
  { label: "About",     href: "/dashboard/about",     icon: HiOutlineUser },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200
        flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">P</span>
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                            font-medium transition-colors
                            ${active
                              ? "bg-orange-50 text-orange-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                       font-medium text-gray-600 hover:bg-red-50 hover:text-red-600
                       transition-colors w-full"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX size={22} /> : <HiMenuAlt2 size={22} />}
          </button>
          <h1 className="text-sm font-semibold text-gray-500 capitalize">
            {pathname.split("/").pop() === "dashboard" ? "Overview" : pathname.split("/").pop()}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}