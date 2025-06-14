"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  Hexagon,
  LineChart,
  ListChecks,
  type LucideIcon,
  Mic,
  Moon,
  Search,
  Sun,
  ThumbsUp,
  TrendingUpIcon as Trending,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [callDuration, setCallDuration] = useState(0)
  const [isCallActive, setIsCallActive] = useState(true)
  const [sentimentScore, setSentimentScore] = useState(65)
  const [sentimentHistory, setSentimentHistory] = useState<number[]>([60, 62, 58, 65, 70, 68, 72, 75, 65, 68])
  const [voicePace, setVoicePace] = useState(85)
  const [voiceTone, setVoiceTone] = useState(72)
  const [voiceClarity, setVoiceClarity] = useState(88)
  const [opportunityScore, setOpportunityScore] = useState(78)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [transcriptLines, setTranscriptLines] = useState<{ text: string; speaker: string; sentiment: string }[]>([])
  const [conversationStage, setConversationStage] = useState("Discovery")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Customer data
  const customerData = {
    name: "Sarah Johnson",
    company: "Acme Technologies",
    position: "IT Director",
    email: "sarah.johnson@acmetech.com",
    phone: "+1 (555) 123-4567",
    lastContact: "2 weeks ago",
    accountValue: "$125,000",
    purchaseHistory: [
      { date: "2023-12-15", product: "Cloud Security Suite", value: "$45,000" },
      { date: "2023-08-03", product: "Data Analytics Platform", value: "$30,000" },
      { date: "2023-03-21", product: "Network Infrastructure", value: "$50,000" },
    ],
    interests: ["Cybersecurity", "Cloud Migration", "AI Integration"],
    painPoints: ["Legacy System Integration", "Budget Constraints", "Team Training"],
  }

  // Recommendations based on conversation
  const recommendations = [
    {
      title: "Highlight cost savings",
      confidence: 92,
      description: "Emphasize 30% cost reduction from cloud migration",
    },
    {
      title: "Address security concerns",
      confidence: 88,
      description: "Share case study on financial sector security implementation",
    },
    {
      title: "Discuss implementation timeline",
      confidence: 75,
      description: "Propose phased approach to minimize disruption",
    },
    {
      title: "Offer training package",
      confidence: 70,
      description: "Include complimentary training sessions for IT team",
    },
  ]

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [isCallActive])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sentiment score with slight variations
      const newSentiment = Math.max(
        40,
        Math.min(95, sentimentScore + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)),
      )
      setSentimentScore(newSentiment)
      setSentimentHistory((prev) => [...prev.slice(1), newSentiment])

      // Update voice metrics
      setVoicePace(
        Math.max(70, Math.min(95, voicePace + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
      )
      setVoiceTone(
        Math.max(60, Math.min(90, voiceTone + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4))),
      )
      setVoiceClarity(
        Math.max(75, Math.min(95, voiceClarity + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
      )

      // Update opportunity score
      setOpportunityScore(
        Math.max(65, Math.min(90, opportunityScore + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))),
      )

      // Simulate conversation progression
      if (callDuration > 60 && callDuration < 180 && conversationStage === "Discovery") {
        setConversationStage("Needs Analysis")
      } else if (callDuration >= 180 && callDuration < 300 && conversationStage === "Needs Analysis") {
        setConversationStage("Solution Presentation")
      } else if (callDuration >= 300 && conversationStage === "Solution Presentation") {
        setConversationStage("Objection Handling")
      }

      // Add transcript lines
      if (Math.random() > 0.7) {
        addTranscriptLine()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [sentimentScore, voicePace, voiceTone, voiceClarity, opportunityScore, callDuration, conversationStage])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 50) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 50) + 50}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format call duration
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Add transcript line
  const addTranscriptLine = () => {
    const speakers = ["You", "Sarah"]
    const speaker = speakers[Math.floor(Math.random() * speakers.length)]

    const youPhrases = [
      "Could you tell me more about your current IT infrastructure?",
      "What challenges are you facing with your current solution?",
      "How would improved security benefit your organization?",
      "Our solution offers significant cost savings compared to your current setup.",
      "We can implement this in phases to minimize disruption.",
      "Many of our clients in your industry have seen ROI within 6 months.",
      "What timeline are you considering for implementation?",
      "Let me explain how our training program works.",
    ]

    const sarahPhrases = [
      "We're currently using a mix of on-premise and cloud solutions.",
      "Integration between systems has been our biggest headache.",
      "Security is a major concern for our board right now.",
      "Our budget for this quarter is pretty tight.",
      "We need something that's easy for our team to learn.",
      "How quickly could we see results after implementation?",
      "That's interesting, could you elaborate on the security features?",
      "Training our team efficiently is a priority for us.",
    ]

    const phrases = speaker === "You" ? youPhrases : sarahPhrases
    const text = phrases[Math.floor(Math.random() * phrases.length)]

    const sentiments = ["positive", "neutral", "negative"]
    const weights = speaker === "You" ? [0.6, 0.35, 0.05] : [0.4, 0.4, 0.2]

    let sentimentIndex = 0
    const rand = Math.random()
    let cumulativeWeight = 0

    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i]
      if (rand <= cumulativeWeight) {
        sentimentIndex = i
        break
      }
    }

    const sentiment = sentiments[sentimentIndex]

    setTranscriptLines((prev) => [...prev.slice(-9), { text, speaker, sentiment }])
  }

  // Get sentiment color
  const getSentimentColor = (score: number) => {
    if (score >= 75) return "text-[#7bbf44]"
    if (score >= 60) return "text-[#016648]"
    if (score >= 45) return "text-yellow-400"
    return "text-red-400"
  }

  // Get sentiment badge color
  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-[#7bbf44]/20 text-[#7bbf44] border-[#7bbf44]/30"
      case "neutral":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-[#011714] to-[#012824] text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#011714]/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-[#016648]/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-[#7bbf44] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-[#016648] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-[#7bbf44] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-[#016648] border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-[#7bbf44] font-mono text-sm tracking-wider">OTP SALES ASSISTANT</div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-[#016648]/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-[#7bbf44]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#7bbf44] to-[#016648] bg-clip-text text-transparent">
              OTP SALES INSIGHT AI
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-[#012824]/80 rounded-full px-3 py-1.5 border border-[#016648]/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-[#7bbf44]/70" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-[#7bbf44]/50"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-[#7bbf44]/70 hover:text-[#7bbf44]">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#7bbf44] rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-[#7bbf44]/70 hover:text-[#7bbf44]"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40&query=professional sales person" alt="User" />
                <AvatarFallback className="bg-[#012824] text-[#7bbf44]">RP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Analytics-First Layout: Top Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Sentiment Score"
            value={sentimentScore}
            icon={ThumbsUp}
            trend={sentimentScore > 70 ? "up" : sentimentScore < 50 ? "down" : "stable"}
            color="primary"
            detail={`Stage: ${conversationStage}`}
          />
          <MetricCard
            title="Voice Analysis"
            value={voiceTone}
            icon={Mic}
            trend="stable"
            color="accent"
            detail={`Pace: ${voicePace}% | Clarity: ${voiceClarity}%`}
          />
          <MetricCard
            title="Opportunity Score"
            value={opportunityScore}
            icon={Trending}
            trend="up"
            color="primary"
            detail={`Confidence: ${opportunityScore > 75 ? "High" : opportunityScore > 60 ? "Medium" : "Low"}`}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - Compact Customer Profile & Voice Stats */}
          <div className="col-span-12 md:col-span-3">
            {/* Compact Customer Profile */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center">
                  <User className="mr-2 h-4 w-4 text-[#7bbf44]" />
                  Customer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40&query=business woman"
                      alt={customerData.name}
                    />
                    <AvatarFallback className="bg-[#012824] text-[#7bbf44] text-xs">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm text-white">{customerData.name}</div>
                    <div className="text-xs text-[#7bbf44]/80">{customerData.position}</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7bbf44]/80">Value:</span>
                    <span className="text-[#7bbf44] font-medium">{customerData.accountValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7bbf44]/80">Last Contact:</span>
                    <span className="text-white/90">{customerData.lastContact}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#016648]/50">
                  <div className="text-xs font-medium mb-1">Key Interests</div>
                  <div className="flex flex-wrap gap-1">
                    {customerData.interests.slice(0, 2).map((interest, index) => (
                      <Badge key={index} className="bg-[#016648]/20 text-[#7bbf44] border-[#016648]/30 text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Statistics Widget */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center text-sm">
                  <Mic className="mr-2 h-4 w-4 text-[#7bbf44]" />
                  Voice Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-[#7bbf44]/80">Speaking Pace</div>
                      <div className="text-xs text-[#7bbf44]">{voicePace}%</div>
                    </div>
                    <Progress value={voicePace} className="h-1.5 bg-[#012824]">
                      <div
                        className="h-full bg-gradient-to-r from-[#016648] to-[#7bbf44] rounded-full"
                        style={{ width: `${voicePace}%` }}
                      />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-[#7bbf44]/80">Tone Variation</div>
                      <div className="text-xs text-[#7bbf44]">{voiceTone}%</div>
                    </div>
                    <Progress value={voiceTone} className="h-1.5 bg-[#012824]">
                      <div
                        className="h-full bg-gradient-to-r from-[#016648] to-[#7bbf44] rounded-full"
                        style={{ width: `${voiceTone}%` }}
                      />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-[#7bbf44]/80">Voice Clarity</div>
                      <div className="text-xs text-[#7bbf44]">{voiceClarity}%</div>
                    </div>
                    <Progress value={voiceClarity} className="h-1.5 bg-[#012824]">
                      <div
                        className="h-full bg-gradient-to-r from-[#016648] to-[#7bbf44] rounded-full"
                        style={{ width: `${voiceClarity}%` }}
                      />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call Status */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xs text-[#7bbf44]/80 mb-1 font-mono">CALL DURATION</div>
                  <div className="text-2xl font-mono text-[#7bbf44]">{formatCallDuration(callDuration)}</div>
                  <Badge variant="outline" className="bg-[#012824] text-[#7bbf44] border-[#016648]/50 text-xs mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#7bbf44] mr-1 animate-pulse"></div>
                    LIVE CALL
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Live Insights Panel */}
          <div className="col-span-12 md:col-span-6">
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm overflow-hidden h-full">
              <CardHeader className="border-b border-[#016648]/50 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-[#7bbf44]" />
                    Live Insights Panel
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-xs text-[#7bbf44]/80">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#7bbf44] mr-1"></div>
                      Sentiment
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#016648] mr-1"></div>
                      Engagement
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#7bbf44]/70 mr-1"></div>
                      Opportunity
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="sentiment" className="w-full h-full">
                  <TabsList className="bg-[#012824] p-1">
                    <TabsTrigger
                      value="sentiment"
                      className="data-[state=active]:bg-[#016648] data-[state=active]:text-white"
                    >
                      Sentiment Trends
                    </TabsTrigger>
                    <TabsTrigger
                      value="transcript"
                      className="data-[state=active]:bg-[#016648] data-[state=active]:text-white"
                    >
                      Live Transcript
                    </TabsTrigger>
                    <TabsTrigger
                      value="insights"
                      className="data-[state=active]:bg-[#016648] data-[state=active]:text-white"
                    >
                      AI Insights
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sentiment" className="mt-4">
                    <div className="h-64 w-full relative bg-[#012824]/80 rounded-lg border border-[#016648]/50 overflow-hidden">
                      <SentimentChart sentimentHistory={sentimentHistory} />
                      <div className="absolute bottom-4 right-4 bg-[#011714]/80 backdrop-blur-sm rounded-md px-3 py-2 border border-[#016648]/50">
                        <div className="text-xs text-[#7bbf44]/80">Current Sentiment</div>
                        <div className={`text-lg font-mono ${getSentimentColor(sentimentScore)}`}>
                          {sentimentScore}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="bg-[#012824]/80 rounded-md p-3 border border-[#016648]/50">
                        <div className="text-xs text-[#7bbf44]/80">Avg. Sentiment</div>
                        <div className="text-lg font-mono text-[#7bbf44]">
                          {Math.round(sentimentHistory.reduce((a, b) => a + b, 0) / sentimentHistory.length)}%
                        </div>
                      </div>
                      <div className="bg-[#012824]/80 rounded-md p-3 border border-[#016648]/50">
                        <div className="text-xs text-[#7bbf44]/80">Peak Sentiment</div>
                        <div className="text-lg font-mono text-[#016648]">{Math.max(...sentimentHistory)}%</div>
                      </div>
                      <div className="bg-[#012824]/80 rounded-md p-3 border border-[#016648]/50">
                        <div className="text-xs text-[#7bbf44]/80">Trend</div>
                        <div className="text-lg font-mono text-[#7bbf44]">↑ +5%</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="transcript" className="mt-4">
                    <div className="bg-[#012824]/80 rounded-lg border border-[#016648]/50 h-80 overflow-hidden flex flex-col">
                      <div className="p-3 border-b border-[#016648]/50 bg-[#012824] flex items-center justify-between">
                        <div className="text-xs text-[#7bbf44]/80">Live Transcript</div>
                        <Badge variant="outline" className="bg-[#012824] text-[#7bbf44] border-[#016648]/50 text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#7bbf44] mr-1 animate-pulse"></div>
                          TRANSCRIBING
                        </Badge>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {transcriptLines.length > 0 ? (
                          transcriptLines.map((line, index) => (
                            <div key={index} className="flex space-x-2">
                              <div
                                className={`font-medium ${line.speaker === "You" ? "text-[#7bbf44]" : "text-blue-400"}`}
                              >
                                {line.speaker}:
                              </div>
                              <div className="flex-1 text-white/90">{line.text}</div>
                              <Badge className={`${getSentimentBadgeColor(line.sentiment)} text-xs h-5`}>
                                {line.sentiment}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-[#7bbf44]/50 py-4">Waiting for conversation...</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="insights" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-[#012824]/80 rounded-md p-4 border border-[#016648]/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-[#7bbf44]">Engagement Analysis</div>
                          <Badge className="bg-[#016648]/20 text-[#7bbf44] border-[#016648]/30">Active</Badge>
                        </div>
                        <div className="text-sm text-white/90">
                          Customer is highly engaged. Sentiment has improved by 15% since the beginning of the call.
                          They're showing strong interest in security features.
                        </div>
                      </div>

                      <div className="bg-[#012824]/80 rounded-md p-4 border border-[#016648]/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-[#016648]">Conversation Stage</div>
                          <Badge className="bg-[#016648]/20 text-[#7bbf44] border-[#016648]/30">
                            {conversationStage}
                          </Badge>
                        </div>
                        <div className="text-sm text-white/90">
                          Currently in the {conversationStage} phase. Customer has expressed key pain points around
                          integration and budget. Consider transitioning to solution presentation.
                        </div>
                      </div>

                      <div className="bg-[#012824]/80 rounded-md p-4 border border-[#016648]/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-[#7bbf44]">Opportunity Insights</div>
                        </div>
                        <div className="text-sm text-white/90">
                          Strong buying signals detected. Customer mentioned board presentation next month - potential
                          decision timeline. Focus on ROI and implementation speed.
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - Recommendations & Actions */}
          <div className="col-span-12 md:col-span-3">
            {/* Real-time Recommendations */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center text-sm">
                  <ListChecks className="mr-2 h-4 w-4 text-[#7bbf44]" />
                  Live Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-[#012824] rounded-md p-3 border border-[#016648]/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-[#7bbf44] text-sm">{rec.title}</div>
                        <Badge variant="outline" className="bg-[#016648]/20 text-[#7bbf44] border-[#016648]/30 text-xs">
                          {rec.confidence}%
                        </Badge>
                      </div>
                      <div className="text-xs text-white/90">{rec.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Points Detected */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center text-sm">
                  <AlertCircle className="mr-2 h-4 w-4 text-[#7bbf44]" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <KeyPointItem
                    title="Budget Constraints"
                    time="04:12"
                    description="Q2 budget limitations"
                    type="concern"
                  />
                  <KeyPointItem
                    title="Security Requirements"
                    time="06:45"
                    description="SOC 2 compliance needed"
                    type="requirement"
                  />
                  <KeyPointItem title="Timeline" time="08:32" description="3-month deployment" type="opportunity" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#012824]/80 border-[#016648]/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton icon={FileText} label="Proposal" />
                  <ActionButton icon={Calendar} label="Demo" />
                  <ActionButton icon={BookOpen} label="Case Study" />
                  <ActionButton icon={CreditCard} label="Pricing" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-[#012824] text-[#7bbf44]" : "text-[#7bbf44]/70 hover:text-[#7bbf44]"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "from-[#016648] to-[#7bbf44]"
      case "accent":
        return "from-[#7bbf44] to-[#016648]"
      default:
        return "from-[#016648] to-[#7bbf44]"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-[#7bbf44]/80">{label}</div>
        <div className="text-xs text-[#7bbf44]/80">{value}%</div>
      </div>
      <div className="h-1.5 bg-[#012824] rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: "primary" | "accent"
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "from-[#016648] to-[#7bbf44] border-[#016648]/30"
      case "accent":
        return "from-[#7bbf44] to-[#016648] border-[#7bbf44]/30"
      default:
        return "from-[#016648] to-[#7bbf44] border-[#016648]/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-[#7bbf44]" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-amber-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-[#012824]/80 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-[#7bbf44]/80">{title}</div>
        <Icon className={`h-5 w-5 text-${color === "primary" ? "[#7bbf44]" : "[#016648]"}`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-white to-white/80">
        {value}%
      </div>
      <div className="text-xs text-[#7bbf44]/70">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-[#016648] to-[#7bbf44]"></div>
    </div>
  )
}

// Sentiment chart component
function SentimentChart({ sentimentHistory }: { sentimentHistory: number[] }) {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-[#7bbf44]/70">100%</div>
        <div className="text-xs text-[#7bbf44]/70">75%</div>
        <div className="text-xs text-[#7bbf44]/70">50%</div>
        <div className="text-xs text-[#7bbf44]/70">25%</div>
        <div className="text-xs text-[#7bbf44]/70">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-[#016648]/30 w-full"></div>
        <div className="border-b border-[#016648]/30 w-full"></div>
        <div className="border-b border-[#016648]/30 w-full"></div>
        <div className="border-b border-[#016648]/30 w-full"></div>
        <div className="border-b border-[#016648]/30 w-full"></div>
      </div>

      {/* Chart line */}
      <div className="absolute inset-0 px-10 py-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7bbf44" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7bbf44" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <path
            d={`M0,${100 - sentimentHistory[0]} ${sentimentHistory
              .map((value, index) => `L${(index + 1) * 10},${100 - value}`)
              .join(" ")} V100 H0 Z`}
            fill="url(#sentimentGradient)"
            opacity="0.5"
          />

          {/* Line */}
          <path
            d={`M0,${100 - sentimentHistory[0]} ${sentimentHistory
              .map((value, index) => `L${(index + 1) * 10},${100 - value}`)
              .join(" ")}`}
            fill="none"
            stroke="#7bbf44"
            strokeWidth="2"
          />

          {/* Data points */}
          {sentimentHistory.map((value, index) => (
            <circle
              key={index}
              cx={(index + 1) * 10}
              cy={100 - value}
              r="1.5"
              fill="white"
              stroke="#7bbf44"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-[#7bbf44]/70">-5m</div>
        <div className="text-xs text-[#7bbf44]/70">-4m</div>
        <div className="text-xs text-[#7bbf44]/70">-3m</div>
        <div className="text-xs text-[#7bbf44]/70">-2m</div>
        <div className="text-xs text-[#7bbf44]/70">-1m</div>
        <div className="text-xs text-[#7bbf44]/70">Now</div>
      </div>
    </div>
  )
}

// Key point item component
function KeyPointItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "concern" | "requirement" | "opportunity" | "need" | "competitive"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "concern":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "requirement":
        return { icon: ListChecks, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "opportunity":
        return { icon: Trending, color: "text-[#7bbf44] bg-[#016648]/10 border-[#016648]/30" }
      case "need":
        return { icon: ThumbsUp, color: "text-[#7bbf44] bg-[#016648]/10 border-[#016648]/30" }
      case "competitive":
        return { icon: Users, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-2">
      <div className={`mt-0.5 p-0.5 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-2.5 w-2.5 ${color.split(" ")[0]}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <div className="text-xs font-medium text-white">{title}</div>
          <div className="ml-1 text-xs text-[#7bbf44]/70">{time}</div>
        </div>
        <div className="text-xs text-[#7bbf44]/80">{description}</div>
      </div>
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-2 px-2 border-[#016648] bg-[#012824] hover:bg-[#016648]/30 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-4 w-4 text-[#7bbf44]" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Add missing imports
function Info(props) {
  return <AlertCircle {...props} />
}
