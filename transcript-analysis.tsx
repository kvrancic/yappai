"use client"
import { useEffect, useState, useRef } from "react"
import type React from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  MicOff,
  Volume2,
  Search,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TranscriptLine {
  id: number
  speaker: "agent" | "customer"
  text: string
  timestamp: number
  duration: number
  sentiment?: "positive" | "neutral" | "negative"
  emotion?: string
  flagged?: boolean
  flagReason?: string
}

interface TimelineSegment {
  id: number
  type: "agent" | "customer" | "silence"
  start: number
  end: number
  sentiment?: "positive" | "neutral" | "negative"
  text?: string
}

interface EventMarker {
  id: number
  type: "dead_air" | "objection" | "budget_concern" | "interruption" | "key_point"
  timestamp: number
  duration?: number
  label: string
  description?: string
  severity?: "low" | "medium" | "high"
}

export default function TranscriptAnalysis() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(420) // 7 minutes
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(75)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [timelineStart, setTimelineStart] = useState(0)
  const [timelineWidth, setTimelineWidth] = useState(duration)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredSegment, setHoveredSegment] = useState<TimelineSegment | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<EventMarker | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartScroll, setDragStartScroll] = useState(0)

  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Sample transcript data
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([])
  const [timelineSegments, setTimelineSegments] = useState<TimelineSegment[]>([])
  const [eventMarkers, setEventMarkers] = useState<EventMarker[]>([])

  // Initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      generateTranscriptData()
      generateTimelineSegments()
      generateEventMarkers()
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Generate transcript data
  const generateTranscriptData = () => {
    const transcript: TranscriptLine[] = [
      {
        id: 1,
        speaker: "agent",
        text: "Good morning, thank you for calling OTP Bank Sales. My name is Robert Parker. How may I assist you today?",
        timestamp: 0,
        duration: 5,
        sentiment: "positive",
        emotion: "professional",
      },
      {
        id: 2,
        speaker: "customer",
        text: "Hi Robert, I'm Sarah Johnson from Acme Technologies. I'm interested in learning about your enterprise security solutions.",
        timestamp: 8,
        duration: 6,
        sentiment: "neutral",
        emotion: "interested",
      },
      {
        id: 3,
        speaker: "agent",
        text: "It's great to hear from you, Sarah. I'd be happy to help you explore our enterprise security offerings. Before we begin, may I verify your company email for our records?",
        timestamp: 16,
        duration: 7,
        sentiment: "positive",
        emotion: "helpful",
      },
      {
        id: 4,
        speaker: "customer",
        text: "Sure, it's sarah.johnson@acmetech.com",
        timestamp: 25,
        duration: 3,
        sentiment: "neutral",
      },
      {
        id: 5,
        speaker: "agent",
        text: "Thank you for that verification. Now, could you tell me a bit about your current security infrastructure and what specific challenges you're facing?",
        timestamp: 30,
        duration: 6,
        sentiment: "neutral",
        emotion: "inquisitive",
      },
      {
        id: 6,
        speaker: "customer",
        text: "Well, we're currently using a mix of on-premise and cloud solutions, but integration has been a real headache. We're also concerned about meeting SOC 2 compliance requirements.",
        timestamp: 40,
        duration: 9,
        sentiment: "negative",
        emotion: "frustrated",
        flagged: true,
        flagReason: "Pain point identified",
      },
      {
        id: 7,
        speaker: "agent",
        text: "I understand those integration challenges can be quite frustrating. Many of our enterprise clients have faced similar issues. The good news is our unified security platform is specifically designed to seamlessly integrate both on-premise and cloud environments.",
        timestamp: 52,
        duration: 10,
        sentiment: "positive",
        emotion: "empathetic",
      },
      {
        id: 8,
        speaker: "customer",
        text: "That sounds promising. But what about the compliance aspect? SOC 2 is critical for us.",
        timestamp: 65,
        duration: 5,
        sentiment: "neutral",
        emotion: "concerned",
      },
      {
        id: 9,
        speaker: "agent",
        text: "Absolutely, compliance is a top priority. Our platform is SOC 2 Type II certified and we provide comprehensive compliance reporting tools. We also offer dedicated support to help you maintain compliance standards.",
        timestamp: 72,
        duration: 9,
        sentiment: "positive",
        emotion: "confident",
      },
      {
        id: 10,
        speaker: "customer",
        text: "That's exactly what we need. What about implementation timelines? We're looking to have something in place within the next quarter.",
        timestamp: 85,
        duration: 6,
        sentiment: "positive",
        emotion: "interested",
        flagged: true,
        flagReason: "Buying signal - timeline mentioned",
      },
      {
        id: 11,
        speaker: "agent",
        text: "We can definitely work within that timeframe. Our typical enterprise implementation takes 4-6 weeks, including migration and training. We also offer a phased approach to minimize disruption to your operations.",
        timestamp: 94,
        duration: 9,
        sentiment: "positive",
        emotion: "reassuring",
      },
      {
        id: 12,
        speaker: "customer",
        text: "The phased approach sounds good, but I'm concerned about our team's ability to adapt. We have limited IT resources.",
        timestamp: 106,
        duration: 6,
        sentiment: "negative",
        emotion: "worried",
      },
      {
        id: 13,
        speaker: "agent",
        text: "That's a valid concern, and we've designed our solution with ease of use in mind. We provide comprehensive training for your team, including hands-on workshops and 24/7 support during the transition period.",
        timestamp: 115,
        duration: 9,
        sentiment: "positive",
        emotion: "supportive",
      },
      {
        id: 14,
        speaker: "customer",
        text: "What about pricing? Our budget for this quarter is somewhat limited.",
        timestamp: 127,
        duration: 4,
        sentiment: "negative",
        emotion: "concerned",
        flagged: true,
        flagReason: "Budget constraint mentioned",
      },
      {
        id: 15,
        speaker: "agent",
        text: "I understand budget considerations are important. We offer flexible pricing models, including monthly subscriptions that can help spread the cost. Based on what you've shared about your needs, I can prepare a customized quote that maximizes value within your budget constraints.",
        timestamp: 133,
        duration: 11,
        sentiment: "positive",
        emotion: "understanding",
      },
    ]

    setTranscriptLines(transcript)
  }

  // Generate timeline segments
  const generateTimelineSegments = () => {
    const segments: TimelineSegment[] = []
    let currentTime = 0
    let segmentId = 1

    // Generate segments based on transcript lines with silence gaps
    transcriptLines.forEach((line, index) => {
      // Add silence before this line if there's a gap
      if (line.timestamp > currentTime) {
        segments.push({
          id: segmentId++,
          type: "silence",
          start: currentTime,
          end: line.timestamp,
        })
      }

      // Add talking segment
      segments.push({
        id: segmentId++,
        type: line.speaker,
        start: line.timestamp,
        end: line.timestamp + line.duration,
        sentiment: line.sentiment,
        text: line.text,
      })

      currentTime = line.timestamp + line.duration
    })

    // Add final silence if needed
    if (currentTime < duration) {
      segments.push({
        id: segmentId++,
        type: "silence",
        start: currentTime,
        end: duration,
      })
    }

    setTimelineSegments(segments)
  }

  // Generate event markers
  const generateEventMarkers = () => {
    const markers: EventMarker[] = [
      {
        id: 1,
        type: "dead_air",
        timestamp: 36,
        duration: 4,
        label: "Dead Air",
        description: "4 seconds of silence detected",
        severity: "medium",
      },
      {
        id: 2,
        type: "objection",
        timestamp: 106,
        duration: 6,
        label: "Customer Objection",
        description: "Concern about team adaptation",
        severity: "high",
      },
      {
        id: 3,
        type: "budget_concern",
        timestamp: 127,
        duration: 4,
        label: "Budget Concern",
        description: "Customer mentioned limited budget",
        severity: "high",
      },
      {
        id: 4,
        type: "key_point",
        timestamp: 85,
        duration: 6,
        label: "Buying Signal",
        description: "Customer mentioned implementation timeline",
        severity: "high",
      },
      {
        id: 5,
        type: "interruption",
        timestamp: 60,
        duration: 2,
        label: "Interruption",
        description: "Agent interrupted customer",
        severity: "low",
      },
    ]

    setEventMarkers(markers)
  }

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1 * playbackSpeed
          if (newTime >= duration) {
            setIsPlaying(false)
            return duration
          }
          return newTime
        })
      }, 100)
    } else if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current)
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, duration])

  // Auto-scroll transcript to current line
  useEffect(() => {
    if (transcriptRef.current) {
      const currentLine = transcriptLines.find(
        (line) => currentTime >= line.timestamp && currentTime < line.timestamp + line.duration,
      )
      if (currentLine) {
        const element = document.getElementById(`transcript-line-${currentLine.id}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentTime, transcriptLines])

  // Ensure playhead is visible in timeline view
  useEffect(() => {
    if (timelineContainerRef.current) {
      const visibleStart = timelineStart
      const visibleEnd = timelineStart + timelineWidth

      // If current time is outside visible range, adjust the view
      if (currentTime < visibleStart || currentTime > visibleEnd) {
        const newStart = Math.max(0, currentTime - timelineWidth / 2)
        setTimelineStart(newStart)
      }
    }
  }, [currentTime, timelineStart, timelineWidth])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case " ": // Space bar
          e.preventDefault()
          togglePlayback()
          break
        case "ArrowLeft": // Left arrow
          e.preventDefault()
          skipBackward()
          break
        case "ArrowRight": // Right arrow
          e.preventDefault()
          skipForward()
          break
        case "f": // F key for fullscreen
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, currentTime])

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const seekTo = (timestamp: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, timestamp)))
  }

  const skipBackward = () => {
    seekTo(currentTime - 10)
  }

  const skipForward = () => {
    seekTo(currentTime + 10)
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentageClicked = x / rect.width
    const visibleDuration = timelineWidth
    const clickedTime = timelineStart + percentageClicked * visibleDuration

    seekTo(clickedTime)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const zoomIn = () => {
    if (zoomLevel < 5) {
      const newZoomLevel = zoomLevel + 0.5
      const newTimelineWidth = duration / newZoomLevel

      // Keep current time in view
      const currentCenter = timelineStart + timelineWidth / 2
      const newStart = Math.max(0, currentCenter - newTimelineWidth / 2)

      setZoomLevel(newZoomLevel)
      setTimelineWidth(newTimelineWidth)
      setTimelineStart(newStart)
    }
  }

  const zoomOut = () => {
    if (zoomLevel > 1) {
      const newZoomLevel = zoomLevel - 0.5
      const newTimelineWidth = duration / newZoomLevel

      // Keep current time in view
      const currentCenter = timelineStart + timelineWidth / 2
      const newStart = Math.max(0, currentCenter - newTimelineWidth / 2)

      setZoomLevel(newZoomLevel)
      setTimelineWidth(newTimelineWidth)
      setTimelineStart(newStart)
    } else {
      // Reset to full view
      setZoomLevel(1)
      setTimelineWidth(duration)
      setTimelineStart(0)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleTimelineDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStartX(e.clientX)
      setDragStartScroll(timelineStart)
    }
  }

  const handleTimelineDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragStartX
      const deltaPercentage = deltaX / rect.width
      const deltaTime = deltaPercentage * timelineWidth

      const newStart = Math.max(0, dragStartScroll - deltaTime)
      const maxStart = duration - timelineWidth

      setTimelineStart(Math.min(newStart, maxStart))
    }
  }

  const handleTimelineDragEnd = () => {
    setIsDragging(false)
  }

  const getEventMarkerIcon = (type: EventMarker["type"]) => {
    switch (type) {
      case "dead_air":
        return <MicOff className="h-3 w-3" />
      case "objection":
        return <AlertCircle className="h-3 w-3" />
      case "budget_concern":
        return <AlertCircle className="h-3 w-3" />
      case "interruption":
        return <X className="h-3 w-3" />
      case "key_point":
        return <Info className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const getEventMarkerColor = (type: EventMarker["type"], severity: EventMarker["severity"] = "medium") => {
    const severityAlpha = severity === "high" ? "1" : severity === "medium" ? "0.8" : "0.6"

    switch (type) {
      case "dead_air":
        return `rgba(239, 68, 68, ${severityAlpha})` // Red
      case "objection":
        return `rgba(249, 115, 22, ${severityAlpha})` // Orange
      case "budget_concern":
        return `rgba(234, 88, 12, ${severityAlpha})` // Dark orange
      case "interruption":
        return `rgba(168, 85, 247, ${severityAlpha})` // Purple
      case "key_point":
        return `rgba(34, 197, 94, ${severityAlpha})` // Green
      default:
        return `rgba(156, 163, 175, ${severityAlpha})` // Gray
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-[#51AF30]"
      case "negative":
        return "text-red-400"
      case "neutral":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  const getSentimentBadgeColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-[#51AF30]/20 text-[#51AF30] border-[#51AF30]/30"
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "neutral":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  // Filter transcript lines based on search
  const filteredTranscriptLines = transcriptLines.filter((line) => {
    return searchQuery === "" || line.text.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex h-screen bg-[#0F1114] text-[#F0F2F5]">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0F1114]/90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-[#2B2F34] rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-t-[#51AF30] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-r-[#3E8F25] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              </div>
              <div className="mt-4 text-[#51AF30] font-mono text-sm tracking-wider">LOADING TRANSCRIPT</div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-[#1A1D21] border-b border-[#2B2F34] py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-[#F0F2F5]">Live Transcript Analysis</h1>
              <Badge className="bg-[#51AF30] text-white">Live</Badge>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#51AF30]" />
                <Input
                  type="text"
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-[#1F2328] border-[#2B2F34] text-[#F0F2F5] placeholder:text-[#A0A4A8] h-9"
                />
              </div>

              <Button variant="outline" className="border-[#51AF30] text-[#51AF30] hover:bg-[#51AF30]/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                variant="outline"
                className="border-[#51AF30] text-[#51AF30] hover:bg-[#51AF30]/10"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 bg-[#0F1114]" : ""}`}
        >
          {/* Advanced Timeline */}
          <div className="px-6 py-4 border-b border-[#2B2F34] bg-[#1A1D21]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-[#51AF30]">Call Timeline</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-[#51AF30] rounded"></div>
                    <span className="text-[#A0A4A8]">Agent</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-[#1B7FBD] rounded"></div>
                    <span className="text-[#A0A4A8]">Customer</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded"></div>
                    <span className="text-[#A0A4A8]">Silence</span>
                  </div>
                </div>
                <div className="text-xs text-[#51AF30]/70">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomOut}
                    disabled={zoomLevel <= 1}
                    className="h-7 w-7 text-[#51AF30] hover:bg-[#2B2F34] disabled:opacity-50"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-[#51AF30]">{zoomLevel}x</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomIn}
                    disabled={zoomLevel >= 5}
                    className="h-7 w-7 text-[#51AF30] hover:bg-[#2B2F34] disabled:opacity-50"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                {zoomLevel > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newStart = Math.max(0, timelineStart - timelineWidth * 0.5)
                        setTimelineStart(newStart)
                      }}
                      className="h-7 w-7 text-[#51AF30] hover:bg-[#2B2F34]"
                      disabled={timelineStart <= 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newStart = Math.min(duration - timelineWidth, timelineStart + timelineWidth * 0.5)
                        setTimelineStart(newStart)
                      }}
                      className="h-7 w-7 text-[#51AF30] hover:bg-[#2B2F34]"
                      disabled={timelineStart + timelineWidth >= duration}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline visualization */}
            <div
              className="relative h-24 bg-[#1F2328] rounded-lg border border-[#2B2F34] overflow-hidden cursor-pointer"
              ref={timelineContainerRef}
              onClick={handleTimelineClick}
              onMouseDown={handleTimelineDragStart}
              onMouseMove={handleTimelineDragMove}
              onMouseUp={handleTimelineDragEnd}
              onMouseLeave={handleTimelineDragEnd}
            >
              <div ref={timelineRef} className="absolute inset-0 flex flex-col">
                {/* Event markers row */}
                <div className="h-6 relative">
                  {eventMarkers.map((marker) => {
                    // Calculate position based on zoom and pan
                    const isVisible =
                      marker.timestamp >= timelineStart && marker.timestamp <= timelineStart + timelineWidth
                    if (!isVisible) return null

                    const left = ((marker.timestamp - timelineStart) / timelineWidth) * 100

                    return (
                      <TooltipProvider key={marker.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-0 flex flex-col items-center cursor-pointer z-20"
                              style={{ left: `${left}%` }}
                              onClick={(e) => {
                                e.stopPropagation()
                                seekTo(marker.timestamp)
                              }}
                              onMouseEnter={() => setHoveredEvent(marker)}
                              onMouseLeave={() => setHoveredEvent(null)}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: getEventMarkerColor(marker.type, marker.severity) }}
                              >
                                {getEventMarkerIcon(marker.type)}
                              </div>
                              <div className="w-0.5 h-2 bg-white/50"></div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <div className="font-medium">{marker.label}</div>
                              <div className="text-xs opacity-75">{marker.description}</div>
                              <div className="text-xs opacity-75">{formatTime(marker.timestamp)}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>

                {/* Agent row */}
                <div className="h-6 border-b border-[#2B2F34]/50 relative">
                  {timelineSegments
                    .filter((segment) => segment.type === "agent")
                    .map((segment) => {
                      // Calculate position based on zoom and pan
                      const start = Math.max(segment.start, timelineStart)
                      const end = Math.min(segment.end, timelineStart + timelineWidth)

                      // Skip if segment is not visible
                      if (end <= timelineStart || start >= timelineStart + timelineWidth) return null

                      const left = ((start - timelineStart) / timelineWidth) * 100
                      const width = ((end - start) / timelineWidth) * 100

                      return (
                        <div
                          key={segment.id}
                          className="absolute h-4 bg-[#51AF30] rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ left: `${left}%`, width: `${width}%`, top: "4px" }}
                          onClick={(e) => {
                            e.stopPropagation()
                            seekTo(segment.start)
                          }}
                          onMouseEnter={() => setHoveredSegment(segment)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        />
                      )
                    })}
                </div>

                {/* Customer row */}
                <div className="h-6 border-b border-[#2B2F34]/50 relative">
                  {timelineSegments
                    .filter((segment) => segment.type === "customer")
                    .map((segment) => {
                      // Calculate position based on zoom and pan
                      const start = Math.max(segment.start, timelineStart)
                      const end = Math.min(segment.end, timelineStart + timelineWidth)

                      // Skip if segment is not visible
                      if (end <= timelineStart || start >= timelineStart + timelineWidth) return null

                      const left = ((start - timelineStart) / timelineWidth) * 100
                      const width = ((end - start) / timelineWidth) * 100

                      return (
                        <div
                          key={segment.id}
                          className="absolute h-4 bg-[#1B7FBD] rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ left: `${left}%`, width: `${width}%`, top: "4px" }}
                          onClick={(e) => {
                            e.stopPropagation()
                            seekTo(segment.start)
                          }}
                          onMouseEnter={() => setHoveredSegment(segment)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        />
                      )
                    })}
                </div>

                {/* Silence row */}
                <div className="h-6 relative">
                  {timelineSegments
                    .filter((segment) => segment.type === "silence")
                    .map((segment) => {
                      // Calculate position based on zoom and pan
                      const start = Math.max(segment.start, timelineStart)
                      const end = Math.min(segment.end, timelineStart + timelineWidth)

                      // Skip if segment is not visible
                      if (end <= timelineStart || start >= timelineStart + timelineWidth) return null

                      const left = ((start - timelineStart) / timelineWidth) * 100
                      const width = ((end - start) / timelineWidth) * 100

                      // Only show silence segments that are wide enough to be visible
                      if (width < 0.5) return null

                      return (
                        <div
                          key={segment.id}
                          className="absolute h-4 bg-gray-500/40 rounded-sm hover:bg-gray-500/60 transition-colors cursor-pointer"
                          style={{ left: `${left}%`, width: `${width}%`, top: "4px" }}
                          onClick={(e) => {
                            e.stopPropagation()
                            seekTo(segment.start)
                          }}
                          onMouseEnter={() => setHoveredSegment(segment)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        />
                      )
                    })}
                </div>

                {/* Row labels */}
                <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-1 text-xs text-[#A0A4A8] pointer-events-none">
                  <div className="h-6">Events</div>
                  <div className="h-6">Agent</div>
                  <div className="h-6">Customer</div>
                  <div className="h-6">Silence</div>
                </div>

                {/* Time markers */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-10 text-xs text-[#51AF30]/70 pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const time = timelineStart + (i * timelineWidth) / 5
                    return (
                      <div key={i} className="text-center">
                        {formatTime(time)}
                      </div>
                    )
                  })}
                </div>

                {/* Playhead */}
                <div
                  className="absolute top-6 bottom-0 w-0.5 bg-white z-20 pointer-events-none"
                  style={{
                    left: `${((currentTime - timelineStart) / timelineWidth) * 100}%`,
                    display:
                      currentTime >= timelineStart && currentTime <= timelineStart + timelineWidth ? "block" : "none",
                  }}
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Hover tooltip */}
                {hoveredSegment && (
                  <div
                    className="absolute -top-10 bg-[#1A1D21] border border-[#2B2F34] rounded px-3 py-2 text-xs text-white pointer-events-none z-30"
                    style={{
                      left: `${((hoveredSegment.start + (hoveredSegment.end - hoveredSegment.start) / 2 - timelineStart) / timelineWidth) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="font-medium">
                      {hoveredSegment.type === "agent"
                        ? "Agent Speaking"
                        : hoveredSegment.type === "customer"
                          ? "Customer Speaking"
                          : "Silence"}
                    </div>
                    <div className="text-[#51AF30]/70">
                      {formatTime(hoveredSegment.start)} - {formatTime(hoveredSegment.end)}
                    </div>
                    {hoveredSegment.sentiment && (
                      <div className={getSentimentColor(hoveredSegment.sentiment)}>
                        Sentiment: {hoveredSegment.sentiment}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipBackward}
                  className="text-[#51AF30] hover:bg-[#2B2F34] h-8 w-8 p-0"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={togglePlayback}
                  className="bg-[#51AF30] hover:bg-[#3E8F25] text-white h-8 w-8 p-0 rounded-full"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipForward}
                  className="text-[#51AF30] hover:bg-[#2B2F34] h-8 w-8 p-0"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <div className="text-xs text-white font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Speed control */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#51AF30]">Speed</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-[#1F2328] border border-[#2B2F34] text-[#F0F2F5] rounded h-7 text-xs px-2"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>

                {/* Volume control */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-[#51AF30]" />
                  <div className="w-20">
                    <Slider
                      value={[volume]}
                      onValueChange={([value]) => setVolume(value)}
                      min={0}
                      max={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <ScrollArea className="flex-1" ref={transcriptRef}>
            <div className="p-6 space-y-4">
              {filteredTranscriptLines.map((line, index) => {
                const isCurrentLine = currentTime >= line.timestamp && currentTime < line.timestamp + line.duration
                const isAgent = line.speaker === "agent"

                return (
                  <div
                    key={line.id}
                    id={`transcript-line-${line.id}`}
                    className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-4 transition-all duration-200`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        isCurrentLine
                          ? isAgent
                            ? "bg-[#51AF30]/20 border-[#51AF30]"
                            : "bg-[#1B7FBD]/20 border-[#1B7FBD]"
                          : "bg-[#1F2328] border-[#2B2F34]"
                      } rounded-lg border p-3 relative ${isAgent ? "rounded-tl-none" : "rounded-tr-none"}`}
                    >
                      {/* Speaker and timestamp */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${isAgent ? "text-[#51AF30]" : "text-[#1B7FBD]"}`}>
                            {isAgent ? "Agent" : "Customer"}
                          </span>
                          <span className="text-xs text-[#51AF30]/70">{formatTime(line.timestamp)}</span>
                        </div>

                        {/* Audio button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => seekTo(line.timestamp)}
                          className="text-[#51AF30] hover:bg-[#2B2F34] h-6 w-6 p-0 ml-2"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Message text */}
                      <p className="text-[#F0F2F5]/90 text-sm">{line.text}</p>

                      {/* Tags */}
                      {(line.sentiment || line.emotion || line.flagged) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {line.sentiment && (
                            <Badge className={`${getSentimentBadgeColor(line.sentiment)} text-xs`}>
                              {line.sentiment}
                            </Badge>
                          )}

                          {line.emotion && (
                            <Badge variant="outline" className="text-xs border-[#2B2F34] text-[#51AF30]/70">
                              {line.emotion}
                            </Badge>
                          )}

                          {line.flagged && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Flagged
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{line.flagReason}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      )}

                      {/* Speaker indicator */}
                      <div
                        className={`absolute ${
                          isAgent ? "-left-2 top-0" : "-right-2 top-0"
                        } w-0 h-0 border-8 border-transparent ${
                          isCurrentLine
                            ? isAgent
                              ? "border-t-[#51AF30]/20"
                              : "border-t-[#1B7FBD]/20"
                            : "border-t-[#1F2328]"
                        }`}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
