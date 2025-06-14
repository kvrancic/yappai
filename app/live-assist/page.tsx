"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LiveAssistPage() {
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLiveAssist = async () => {
      try {
        const res = await fetch('http://localhost:8080')
        const data = await res.text()
        setResponse(data)
      } catch (error) {
        setError("Failed to connect to Live Assist server. Please make sure the server is running on localhost:8080.")
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
        <h1 className="text-2xl font-semibold">Connecting to Live Assist...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1D21] text-white p-4">
        <div className="max-w-md text-center">
          <Image
            src="/error-illustration.svg"
            alt="Connection Error"
            width={200}
            height={200}
            className="mb-6"
          />
          <h1 className="text-2xl font-semibold mb-4">Connection Error</h1>
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
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-semibold mb-6">Live Assist</h1>
        <div className="bg-[#1F2328] rounded-lg p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
            {response}
          </pre>
        </div>
      </div>
    </div>
  )
} 