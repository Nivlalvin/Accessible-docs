'use client'

import { useState, useEffect } from 'react'
import DocumentCard from '@/components/DocumentCard'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'
import DashboardLayout from '@/components/DashboardLayout'
import { Document } from '@/types'

const API_URL = "http://127.0.0.1:8000" // backend base URL
const LOCAL_STORAGE_KEY = 'docuease-settings'

export default function DashboardPage() {
  // Default values
  const [calmUI, setCalmUI] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [docsError, setDocsError] = useState<string | null>(null)

  // Load saved settings
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const settings = JSON.parse(stored)
      setCalmUI(settings.calmUI)
      setFocusMode(settings.focusMode)
    }
  }, [])

  // Fetch documents from backend
  useEffect(() => {
    async function fetchDocs() {
      setLoadingDocs(true)
      try {
        const res = await fetch(`${API_URL}/documents`)
        if (!res.ok) throw new Error('Failed to load documents')
        const data: Document[] = await res.json()
        setDocuments(data)
      } catch (err: any) {
        console.error(err)
        setDocsError(err.message || 'Unknown error')
      } finally {
        setLoadingDocs(false)
      }
    }
    fetchDocs()
  }, [])

  return (
    <DashboardLayout>
      <div className={`w-full min-h-screen ${calmUI ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-800'}`}>        
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

        {loadingDocs && <p>Loading documents...</p>}
        {docsError && <p className="text-red-500">Error: {docsError}</p>}

        {!loadingDocs && !docsError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} calmUI={calmUI} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}