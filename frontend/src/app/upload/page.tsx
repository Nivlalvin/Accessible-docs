'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = "http://127.0.0.1:8000";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- States ---
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [docId, setDocId] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [simplificationData, setSimplificationData] = useState<any>(null);
  const [termsData, setTermsData] = useState<any>(null);
  const [outputText, setOutputText] = useState('');
  const [readingScore, setReadingScore] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string }[]>([]);
  const [question, setQuestion] = useState('');
  const [activeTab, setActiveTab] = useState<'child' | 'teen' | 'adult' | 'terms' | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [calmUI, setCalmUI] = useState(false);

  // --- Upload & Process Document ---
  async function processDocument() {
    if (!file) return alert("Please select a file first.");
    setUploadStatus("Processing document...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Extract text
      const textRes = await fetch(`${API_URL}/extract-text`, { method: "POST", body: formData });
      const textData = await textRes.json();
      setOriginalText(textData.text);

      // Process for RAG / DB
      const processRes = await fetch(`${API_URL}/process-document`, { method: "POST", body: formData });
      const processData = await processRes.json();
      setDocId(processData.document_id);

      setUploadStatus("Document ready!");
      setChatHistory([]);
      setShowViewer(true);
    } catch (err) {
      setUploadStatus("Error processing document.");
      console.error(err);
    }
  }

  // --- Simplify Text ---
  async function simplifyText() {
    if (!originalText) return alert("No text to simplify.");
    setActionStatus("Simplifying into 3 levels...");

    try {
      const res = await fetch(`${API_URL}/simplify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText })
      });

      if (res.status === 429) {
        const data = await res.json();
        setActionStatus(`Rate limit reached: ${data.error?.message || 'Please try again later.'}`);
        return;
      }

      if (!res.ok) throw new Error("Simplification failed");

      const data = await res.json();
      setSimplificationData(data);
      setActionStatus("Simplification complete!");
      showTab('child');

    } catch (err: any) {
      console.error(err);
      setActionStatus(`Error simplifying: ${err.message}`);
    }
  }

  async function extractTerms() {
    if (!originalText) return alert("No text to extract terms from.");
    setActionStatus("Extracting terms...");

    try {
      const res = await fetch(`${API_URL}/extract-terms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText })
      });

      if (res.status === 429) {
        const data = await res.json();
        setActionStatus(`Rate limit reached: ${data.error?.message || 'Please try again later.'}`);
        return;
      }

      if (!res.ok) throw new Error("Term extraction failed");

      const data = await res.json();
      setTermsData(data);
      setActionStatus("Terms extracted!");
      showTab('terms');

    } catch (err: any) {
      console.error(err);
      setActionStatus(`Error extracting terms: ${err.message}`);
    }
  }

  // --- Show Tab (Child / Teen / Adult / Terms) ---
  function showTab(tab: 'child' | 'teen' | 'adult' | 'terms') {
    setActiveTab(tab);
    if (tab === 'terms') {
      if (!termsData) return;
      setOutputText(termsData.terms.map((t: any) => `• ${t.term}: ${t.definition}`).join('\n\n'));
      setReadingScore(`Found ${termsData.count} key terms.`);
    } else {
      if (!simplificationData) return;
      setOutputText(simplificationData[tab]);
      if(simplificationData.reading_analysis?.simplified?.[tab]) {
        const stats = simplificationData.reading_analysis.simplified[tab].analysis;
        setReadingScore(`Grade Level: ${stats.grade_level} | Reading Ease: ${stats.reading_ease}`);
      }
    }
  }

  // --- Ask Question (RAG / Chat) ---
  async function askQuestion() {
    if (!docId) return alert("Please upload a document first.");
    if (!question.trim()) return;
    const q = question.trim();
    setChatHistory(prev => [...prev, { user: q, ai: '' }]);
    setQuestion('');

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: docId, question: q }),
      });
      const data = await res.json();
      setChatHistory(prev => prev.map((c, i) => i === prev.length - 1 ? { ...c, ai: data.answer } : c));
    } catch (err) {
      setChatHistory(prev => prev.map((c, i) => i === prev.length - 1 ? { ...c, ai: 'Error: Failed to get answer.' } : c));
    }
  }

  // --- Clear All ---
  function clearAll() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setOriginalText('');
    setSimplificationData(null);
    setTermsData(null);
    setOutputText('');
    setReadingScore('');
    setChatHistory([]);
    setDocId(null);
    setShowViewer(false);
    setActiveTab(null);
    setUploadStatus('');
    setActionStatus('');
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${calmUI ? 'bg-gray-100' : 'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100'}`}>
      {/* --- Navbar --- */}
      <div className="flex justify-between mb-6 items-center">
        <div className="flex gap-4">
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Dashboard</button>
          <button onClick={() => setFocusMode(!focusMode)} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          </button>
          <button onClick={() => setCalmUI(!calmUI)} className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500">
            {calmUI ? 'Normal UI' : 'Calm UI'}
          </button>
        </div>
        <button onClick={clearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Clear All</button>
      </div>

      {/* --- Upload Card --- */}
      <div className={`flex justify-center transition-all duration-500 ${!showViewer ? 'min-h-[60vh] items-center' : ''}`}>
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 flex flex-col items-center transition-all">
          {!showViewer ? (
            <>
              <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Upload Your Document</h1>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] ?? null)} className="mb-4 block w-full border border-gray-300 rounded p-2" />
              <button onClick={processDocument} className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition font-semibold">
                Upload & Process
              </button>
              <p className="text-sm text-gray-500 mt-2">{uploadStatus}</p>
            </>
          ) : (
            <p className="text-gray-500 font-semibold animate-pulse">Document processed! Scroll down for output.</p>
          )}
        </div>
      </div>

      {/* --- Viewer Section --- */}
      {showViewer && (
        <div className="transition-all duration-500 mt-6 space-y-6">
          {/* Original text + Simplify/Terms (hidden in focus mode) */}
          {!focusMode && (
            <>
              <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-500">Original Text</h2>
                <textarea value={originalText} readOnly className="w-full h-64 border rounded p-2 text-gray-400" />
                <div className="mt-4 flex gap-4">
                  <button onClick={simplifyText} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Simplify Text</button>
                  <button onClick={extractTerms} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Extract Terms</button>
                </div>
                <p className="text-sm text-gray-500 mt-2">{actionStatus}</p>
              </div>
            </>
          )}

          {/* AI Output */}
          {activeTab && (
            <div className="bg-white p-6 rounded shadow">
              {activeTab !== 'terms' && (
                <div className="flex gap-2 mb-2">
                  {['child','teen','adult'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab as any); showTab(tab as any); }}
                      className={`px-3 py-1 rounded font-semibold ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <textarea value={outputText} readOnly className="w-full h-48 border rounded p-2 text-sm bg-gray-50 text-gray-400" />
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance(outputText))} 
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  disabled={!outputText}
                >
                  Read Aloud
                </button>
                <button 
                  onClick={() => speechSynthesis.cancel()} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Stop Reading
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">{readingScore}</p>
            </div>
          )}

          {/* Chat */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Chat with Document (RAG)</h2>
            <div className="h-48 border rounded p-4 mb-4 overflow-y-auto bg-gray-50 text-sm space-y-2">
              {chatHistory.length === 0 ? <p className="text-gray-400 italic">Upload a document first...</p> : (
                chatHistory.map((c, i) => (
                  <div key={i}>
                    <p className='text-gray-500'><strong>You:</strong> {c.user}</p>
                    <p className="text-blue-700"><strong>AI:</strong> {c.ai}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="flex-1 border rounded p-2 text-gray-500" placeholder="Ask a question..." />
              <button onClick={askQuestion} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ask</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}