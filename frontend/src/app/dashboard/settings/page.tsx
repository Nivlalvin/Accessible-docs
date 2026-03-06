'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import AccessibilityToolbar from '@/components/AccessibilityToolbar'

const LOCAL_STORAGE_KEY = 'docuease-settings'

type Settings = {
  calmUI: boolean
  focusMode: boolean
  autismFriendly: boolean
  highContrast: boolean
  fontSize: 'sm' | 'md' | 'lg'
}

export default function SettingsPage() {
  const defaultSettings: Settings = {
    calmUI: false,
    focusMode: false,
    autismFriendly: false,
    highContrast: false,
    fontSize: 'md',
  }

  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  // Load saved settings
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) setSettings(JSON.parse(stored))
  }, [])

  const toggleSetting = (key: keyof Settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => {
    setSettings({ ...settings, fontSize: size })
  }

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Dynamic classes
  const bgClass = settings.calmUI
    ? settings.autismFriendly ? 'bg-primary-50 text-gray-900' : 'bg-gray-100 text-gray-900'
    : settings.highContrast ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'

  const fontClass =
    settings.fontSize === 'sm' ? 'text-sm' : settings.fontSize === 'lg' ? 'text-lg' : 'text-base'

  const toggleClasses = "w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer"
  const switchClasses = (active: boolean) => `absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${active ? 'translate-x-6 bg-primary-500' : ''}`

  return (
    <div className={`flex flex-col min-h-screen ${bgClass} ${fontClass}`}>
      <Sidebar />

      <main className={`flex-1 p-6 ${settings.focusMode ? 'max-w-4xl mx-auto' : ''}`}>
        <AccessibilityToolbar
          calmUI={settings.calmUI}
          focusMode={settings.focusMode}
          onCalmToggle={() => toggleSetting('calmUI')}
          onFocusToggle={() => toggleSetting('focusMode')}
        />

        <h1 className="text-3xl font-bold text-primary-700 mb-8">Settings</h1>

        <div className="space-y-6 max-w-md">
          {['calmUI', 'focusMode', 'autismFriendly', 'highContrast'].map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className={toggleClasses} onClick={() => toggleSetting(key as keyof Settings)}>
                <div className={switchClasses(settings[key as keyof Settings] as boolean)} />
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <label className="font-medium">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value as 'sm' | 'md' | 'lg')}
              className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-800 hover:border-gray-400 transition"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-8 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition"
        >
          Save Settings
        </button>

        {saved && <p className="mt-2 text-green-600 font-medium">Settings saved!</p>}
      </main>

      <footer className="p-4 text-center bg-gray-100 text-gray-600 border-t border-gray-200">
        © 2026 DocuEase. All rights reserved.
      </footer>
    </div>
  )
}