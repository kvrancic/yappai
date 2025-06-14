// app/live-assist/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function LiveAssistPage() {
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLiveAssist = async () => {
      try {
        const res = await fetch("http://localhost:8080", {
          headers: { Accept: "text/plain" },
        })
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status} ${res.statusText}`)
        }
        const text = await res.text()
        setResponse(text)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to Live Assist server. Please make sure the server is running on localhost:8080."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLiveAssist()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1D21] text-white">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <h1 className="text-2xl font-semibold">Connecting to Live Assist…</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1D21] text-white p-4">
        <div className="max-w-md text-center">
          {/* Centered red X */}
          <svg
            className="mx-auto mb-6"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="20"
              y1="20"
              x2="80"
              y2="80"
              stroke="red"
              stroke-width="10"
              stroke-linecap="round"
            />
            <line
              x1="80"
              y1="20"
              x2="20"
              y2="80"
              stroke="red"
              stroke-width="10"
              stroke-linecap="round"
            />
          </svg>

          <h1 className="text-2xl font-semibold mb-2">Connection Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#51AF30] text-white rounded-md hover:bg-[#418C26] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1D21] text-white p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6">Live Assist</h1>
        <div className="bg-[#1F2328] rounded-lg p-6 overflow-x-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
            {response}
          </pre>
        </div>
      </div>
    </div>
  )
}
