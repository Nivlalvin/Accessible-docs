'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DocumentCard from '@/components/DocumentCard'
import Sidebar from '@/components/Sidebar'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'
import { Document } from '@/types'

const LOCAL_STORAGE_KEY = 'docuease-settings'

export default function HistoryPage() {
  const router = useRouter()

  // Default values
  const [calmUI, setCalmUI] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  // Load saved settings on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const settings = JSON.parse(stored)
      setCalmUI(settings.calmUI)
      setFocusMode(settings.focusMode)
    }
  }, [])

  // Example document history
  const historyDocs: Document[] = [
    { id: '1', title: 'Project Proposal', uploadedAt: '2026-03-01', actions: ['Simplified', 'Q&A'] },
    { id: '2', title: 'User Manual', uploadedAt: '2026-02-25', actions: ['ReadAloud'] },
    { id: '3', title: 'Research Notes', uploadedAt: '2026-02-20', actions: ['Simplified'] },
  ]

  return (
    <div className={`flex h-screen ${calmUI ? 'bg-gray-100 text-gray-900' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className={`flex-1 p-6 ${focusMode ? 'max-w-4xl mx-auto' : ''}`}>
        {/* Accessibility Toolbar */}
        <AccessibilityToolbar
          calmUI={calmUI}
          focusMode={focusMode}
          onCalmToggle={() => {
            setCalmUI(!calmUI)
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ calmUI: !calmUI, focusMode }))
          }}
          onFocusToggle={() => {
            setFocusMode(!focusMode)
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ calmUI, focusMode: !focusMode }))
          }}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary-700">Document History</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-semibold transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/upload')}
              className="px-5 py-2 rounded-full bg-success-500 hover:bg-success-700 text-white font-semibold transition"
            >
              Upload New
            </button>
          </div>
        </div>

        {/* Document cards */}
        {historyDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} calmUI={calmUI} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-gray-500">
            <p className="text-lg">No documents found in your history.</p>
            <button
              onClick={() => router.push('/upload')}
              className="mt-4 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition"
            >
              Upload Your First Document
            </button>
          </div>
        )}
      </main>
    </div>
  )
}