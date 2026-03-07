'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HomeIcon, ArrowUpTrayIcon, DocumentChartBarIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="h-6 w-6" /> },
    { label: 'Upload', href: '/upload', icon: <ArrowUpTrayIcon className="h-6 w-6" /> },
    { label: 'Documents History', href: '/dashboard/history', icon: <DocumentChartBarIcon className="h-6 w-6" /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <WrenchScrewdriverIcon className="h-6 w-6" /> },
  ]

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo / Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h2 className="font-bold text-xl text-purple-700">ELEWA</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded-md"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 p-4 hover:bg-purple-50 rounded-lg transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {item.icon}
            {!collapsed && <span className="font-medium text-gray-700">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-gray-500 text-sm">
        {!collapsed ? 'v1.0 - Hackathon Build' : 'v1.0'}
      </div>
    </aside>
  )
}