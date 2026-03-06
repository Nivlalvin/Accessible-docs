'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png" // <-- your new logo
            alt="DocuEase Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-purple-700">ELEWA</h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full border border-purple-700 text-purple-700 font-medium hover:bg-purple-50 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-full bg-purple-700 text-white font-medium hover:bg-purple-800 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-20 gap-12">
        
        {/* Left: Text + CTA */}
        <div className="flex flex-col gap-6 max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 leading-tight">
            Make Documents Easier to Read with AI
          </h1>
          <p className="text-lg text-gray-700">
            Upload your documents, simplify the text, focus on important parts, and get instant Q&A — all designed for accessibility and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
            <Link
              href="/upload"
              className="px-6 py-3 rounded-full bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
            >
              Upload Document
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-full border border-purple-700 text-purple-700 font-semibold hover:bg-purple-50 transition"
            >
              Create Account
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
              <Image src="/upload.png" alt="Upload" width={50} height={50} />
              <h3 className="mt-4 font-semibold text-purple-700">Upload Documents</h3>
              <p className="text-gray-600 text-sm mt-1">PDFs, Word docs, and more, ready to process.</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
              <Image src="/simplify.png" alt="Simplify" width={50} height={50} />
              <h3 className="mt-4 font-semibold text-purple-700">Simplify & Focus</h3>
              <p className="text-gray-600 text-sm mt-1">Child-friendly, teen-friendly, or full context modes.</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
              <Image src="/speech.jpg" alt="Speech" width={50} height={50} />
              <h3 className="mt-4 font-semibold text-purple-700">Listen & Learn</h3>
              <p className="text-gray-600 text-sm mt-1">Text-to-speech for hands-free reading.</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
              <Image src="/qa.jpg" alt="Q&A" width={50} height={50} />
              <h3 className="mt-4 font-semibold text-purple-700">Instant Q&A</h3>
              <p className="text-gray-600 text-sm mt-1">Ask questions about your document and get answers fast.</p>
            </div>
          </div>
        </div>

        {/* Right: Hero Illustration */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/elewa-home.png" // <-- hero image placeholder
            alt="AI assisting with documents"
            width={500}
            height={400}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-700 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 Elewa. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}