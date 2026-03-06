'use client'

import { useState, useEffect } from 'react'
import DocumentCard from '@/components/DocumentCard'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'
import DashboardLayout from '@/components/DashboardLayout'
import { Document } from '@/types'

const LOCAL_STORAGE_KEY = 'docuease-settings'

export default function DashboardPage() {
  // Default values
  const [calmUI, setCalmUI] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  // Load saved settings
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const settings = JSON.parse(stored)
      setCalmUI(settings.calmUI)
      setFocusMode(settings.focusMode)
    }
  }, [])

  // Example documents
  const documents: Document[] = [
    { id: '1', title: 'Project Proposal', uploadedAt: '2026-03-01', actions: ['Simplified', 'Q&A'] },
    { id: '2', title: 'User Manual', uploadedAt: '2026-02-25', actions: ['ReadAloud'] },
    { id: '3', title: 'Research Notes', uploadedAt: '2026-02-20', actions: ['Simplified'] },
  ]

  return (
    <DashboardLayout>
      <div className={`flex h-screen ${calmUI ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-800'}`}>
        <main className={`flex-1 p-6 ${focusMode ? 'max-w-4xl mx-auto' : ''}`}>
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

          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} calmUI={calmUI} />
            ))}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}