"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  Calendar,
  Clock,
  FileText,
  LineChart,
  MessageSquare,
  Mic,
  Search,
  ThumbsUp,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardOTP() {
  const [callDuration, setCallDuration] = useState(0)
  const [isCallActive, setIsCallActive] = useState(true)
  const [sentimentScore, setSentimentScore] = useState(65)
  const [sentimentHistory, setSentimentHistory] = useState<number[]>([60, 62, 58, 65, 70, 68, 72, 75, 65, 68])
  const [speakingPace, setSpeakingPace] = useState(85)
  const [interruptions, setInterruptions] = useState(3)
  const [talkListenRatio, setTalkListenRatio] = useState(0.65)
  const [opportunityScore, setOpportunityScore] = useState(78)
  const [dealStageMovement, setDealStageMovement] = useState("+1")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [transcriptLines, setTranscriptLines] = useState<{ text: string; speaker: string; sentiment: string }[]>([])
  const [conversationStage, setConversationStage] = useState("Discovery")
  const [fillerWords, setFillerWords] = useState({ um: 4, like: 2, actually: 3, basically: 1, you_know: 2 })
  const [toneEmotions, setToneEmotions] = useState({
    confident: 45,
    hesitant: 15,
    friendly: 30,
    concerned: 10,
  })

  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Customer data
  const customerData = {
    name: "Sarah Johnson",
    company: "Acme Technologies",
    position: "IT Director",
    email: "sarah.johnson@acmetech.com",
    phone: "+1 (555) 123-4567",
    lastContact: "2 weeks ago",
    dealSize: "$125,000",
    stage: "Qualification",
    interests: ["Cybersecurity", "Cloud Migration", "AI Integration"],
    objections: ["Budget Constraints", "Implementation Timeline", "Team Training"],
  }

  // Conversation funnel data - General statistics
  const conversationFunnel = [
    {
      stage: "Introduction",
      avgDuration: "01:23",
      successRate: 92,
      totalCalls: 847,
      sentiment: "positive",
      keywords: ["greeting", "rapport", "agenda"],
    },
    {
      stage: "Discovery",
      avgDuration: "04:35",
      successRate: 78,
      totalCalls: 782,
      sentiment: "neutral",
      keywords: ["needs", "challenges", "current solution"],
    },
    {
      stage: "Qualification",
      avgDuration: "03:12",
      successRate: 65,
      totalCalls: 612,
      sentiment: "positive",
      keywords: ["budget", "timeline", "decision process"],
    },
    {
      stage: "Objection Handling",
      avgDuration: "02:48",
      successRate: 54,
      totalCalls: 398,
      sentiment: "neutral",
      keywords: ["concerns", "alternatives", "comparison"],
    },
    {
      stage: "Closing",
      avgDuration: "01:56",
      successRate: 42,
      totalCalls: 215,
      sentiment: "positive",
      keywords: ["agreement", "next steps", "commitment"],
    },
  ]

  // AI recommendations
  const recommendations = [
    {
      title: "Discuss ROI timeline",
      confidence: 92,
      description: "Customer mentioned budget concerns - address expected ROI within 6 months",
      priority: "critical",
    },
    {
      title: "Offer phased implementation",
      confidence: 88,
      description: "Mention gradual rollout to address resource concerns",
      priority: "high",
    },
    {
      title: "Share case study",
      confidence: 75,
      description: "Reference similar IT company in financial sector",
      priority: "moderate",
    },
    {
      title: "Ask about team size",
      confidence: 70,
      description: "Gather information about IT team for training proposal",
      priority: "moderate",
    },
  ]

  // Engagement timeline data
  const engagementTimeline = [
    { stage: "Introduction", score: 85 },
    { stage: "Discovery", score: 78 },
    { stage: "Qualification", score: 65 },
    { stage: "Objection Handling", score: 0 },
    { stage: "Closing", score: 0 },
  ]

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

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
      setSpeakingPace(
        Math.max(70, Math.min(95, speakingPace + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
      )
      setTalkListenRatio(Math.max(0.4, Math.min(0.8, talkListenRatio + (Math.random() > 0.5 ? 0.02 : -0.02))))

      // Update opportunity score
      setOpportunityScore(
        Math.max(65, Math.min(90, opportunityScore + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))),
      )

      // Simulate conversation progression
      if (callDuration > 60 && callDuration < 180 && conversationStage === "Discovery") {
        setConversationStage("Qualification")
      } else if (callDuration >= 180 && callDuration < 300 && conversationStage === "Qualification") {
        setConversationStage("Objection Handling")
      } else if (callDuration >= 300 && conversationStage === "Objection Handling") {
        setConversationStage("Closing")
      }

      // Add transcript lines
      if (Math.random() > 0.7) {
        addTranscriptLine()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [sentimentScore, speakingPace, talkListenRatio, opportunityScore, callDuration, conversationStage])

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
    if (score >= 75) return "text-[#51AF30]"
    if (score >= 60) return "text-[#3E8F25]"
    if (score >= 45) return "text-yellow-400"
    return "text-red-400"
  }

  // Get sentiment badge color
  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-[#51AF30]/20 text-[#51AF30] border-[#51AF30]/30"
      case "neutral":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "negative":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "moderate":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

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
                <div className="absolute inset-6 border-4 border-b-[#51AF30] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
                <div className="absolute inset-8 border-4 border-l-[#3E8F25] border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
              </div>
              <div className="mt-4 text-[#51AF30] font-mono text-sm tracking-wider">OTP SALES ASSISTANT</div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-[#1A1D21] border-b border-[#2B2F34] py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-[#F0F2F5]">Sales Analytics Dashboard</h1>
              <Badge className="bg-[#51AF30] text-white">Live Call</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-[#1F2328] rounded-full px-3 py-1.5">
                <Search className="h-4 w-4 text-[#51AF30]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-[#A0A4A8]"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative text-[#A0A4A8] hover:text-[#F0F2F5]">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#51AF30] rounded-full animate-pulse"></span>
              </Button>

              <div className="flex items-center space-x-2 bg-[#1F2328] rounded-full px-2 py-1">
                <Clock className="h-4 w-4 text-[#51AF30]" />
                <span className="text-sm text-[#F0F2F5]">{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Dashboard summary */}
          <div className="bg-[#1F2328] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-[#1A1D21] p-3 rounded-full">
                  <Activity className="h-6 w-6 text-[#51AF30]" />
                </div>
                <div>
                  <div className="text-sm text-[#A0A4A8]">Sales Performance Dashboard</div>
                  <div className="text-lg font-semibold text-[#F0F2F5]">Weekly Overview</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#51AF30] text-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-white mr-1 animate-pulse"></div>
                  Data Live
                </Badge>
                <div className="text-sm text-[#A0A4A8]">Last updated: {formatTime(currentTime)}</div>
              </div>
            </div>
          </div>

          {/* Analytics grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main analytics */}
            <div className="col-span-12 lg:col-span-8">
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <MetricCard
                  title="Sentiment Score"
                  value={sentimentScore}
                  icon={ThumbsUp}
                  trend={sentimentScore > 70 ? "up" : sentimentScore < 50 ? "down" : "stable"}
                  detail={`+5% from last call`}
                />
                <MetricCard
                  title="Opportunity Score"
                  value={opportunityScore}
                  icon={TrendingUp}
                  trend="up"
                  detail={`Deal stage: ${dealStageMovement}`}
                />
                <MetricCard
                  title="Voice Metrics"
                  value={speakingPace}
                  icon={Mic}
                  trend="stable"
                  detail={`${interruptions} interruptions | ${Math.round(talkListenRatio * 100)}% talk ratio`}
                />
              </div>

              {/* Engagement & Sentiment Trends */}
              <div className="grid grid-cols-1 gap-6 mb-6">
                <Card className="bg-[#1F2328] border-[#2B2F34]">
                  <CardHeader className="border-b border-[#2B2F34] pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#F0F2F5] flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-[#51AF30]" />
                        Engagement & Sentiment Trends
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 rounded-full bg-[#51AF30]"></div>
                          <span className="text-[#A0A4A8]">Sentiment</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 rounded-full bg-red-400"></div>
                          <span className="text-[#A0A4A8]">Event Marker</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Sentiment Over Time Chart */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-[#51AF30]">Sentiment Over Time</h3>
                        </div>
                        <div className="h-48 w-full relative bg-[#1A1D21]/50 rounded-lg border border-[#2B2F34] overflow-hidden">
                          <SentimentChart sentimentHistory={sentimentHistory} />
                        </div>
                      </div>

                      {/* Engagement Timeline */}
                      <div>
                        <h3 className="text-sm font-medium text-[#51AF30] mb-2">Engagement Timeline</h3>
                        <div className="bg-[#1A1D21]/50 rounded-lg border border-[#2B2F34] p-4">
                          <div className="flex items-center justify-between">
                            {engagementTimeline.map((stage, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div className="text-xs text-[#A0A4A8] mb-1">{stage.stage}</div>
                                <div className="h-20 w-12 bg-[#2B2F34] rounded-lg relative overflow-hidden">
                                  <div
                                    className="absolute bottom-0 w-full bg-[#51AF30]"
                                    style={{ height: `${stage.score}%` }}
                                  ></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">
                                      {stage.score > 0 ? `${stage.score}%` : "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conversation Funnel Breakdown */}
              <Card className="bg-[#1F2328] border-[#2B2F34] mb-6">
                <CardHeader className="border-b border-[#2B2F34] pb-3">
                  <CardTitle className="text-[#F0F2F5] flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-[#51AF30]" />
                    Conversation Funnel Breakdown - Weekly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {conversationFunnel.map((stage, index) => (
                      <div key={index} className="border rounded-lg p-4 border-[#2B2F34] bg-[#1F2328]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#51AF30] text-white flex items-center justify-center mr-3 text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-[#F0F2F5]">{stage.stage}</h3>
                              <div className="text-xs text-[#A0A4A8]">{stage.totalCalls} calls this week</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#51AF30]">{stage.successRate}%</div>
                            <div className="text-xs text-[#A0A4A8]">Success Rate</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-[#A0A4A8] mb-1">Avg. Duration</div>
                            <div className="text-sm text-[#F0F2F5]">{stage.avgDuration}</div>
                          </div>
                          <div>
                            <div className="text-xs text-[#A0A4A8] mb-1">Sentiment</div>
                            <Badge className={getSentimentBadgeColor(stage.sentiment)}>{stage.sentiment}</Badge>
                          </div>
                          <div>
                            <div className="text-xs text-[#A0A4A8] mb-1">Key Topics</div>
                            <div className="flex flex-wrap gap-1">
                              {stage.keywords.slice(0, 2).map((keyword, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-[#2B2F34] text-[#A0A4A8]">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar showing conversion rate */}
                        <div className="mt-3">
                          <div className="w-full bg-[#2B2F34] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#51AF30] to-[#51AF30] rounded-full transition-all duration-500"
                              style={{ width: `${stage.successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Funnel visualization */}
                  <div className="mt-6 pt-6 border-t border-[#2B2F34]">
                    <div className="text-sm text-[#51AF30] mb-3">Conversion Funnel</div>
                    <div className="flex items-center justify-between">
                      {conversationFunnel.map((stage, index) => (
                        <div key={index} className="flex items-center">
                          <div className="text-center">
                            <div className="text-xs text-[#A0A4A8] mb-1">{stage.stage}</div>
                            <div className="text-lg font-bold text-[#F0F2F5]">{stage.totalCalls}</div>
                            <div className="text-xs text-[#51AF30]">{stage.successRate}%</div>
                          </div>
                          {index < conversationFunnel.length - 1 && <div className="mx-2 text-[#A0A4A8]">→</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Behavior Overview */}
              <Card className="bg-[#1F2328] border-[#2B2F34]">
                <CardHeader className="border-b border-[#2B2F34] pb-3">
                  <CardTitle className="text-[#F0F2F5] flex items-center">
                    <Mic className="mr-2 h-5 w-5 text-[#51AF30]" />
                    Voice Behavior Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Talk Ratio Chart */}
                    <div>
                      <h3 className="text-sm font-medium text-[#51AF30] mb-3">Talk Ratio</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2B2F34" strokeWidth="15" />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#51AF30"
                              strokeWidth="15"
                              strokeDasharray={`${Math.round(talkListenRatio * 251.2)} 251.2`}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-xl font-bold text-[#51AF30]">
                                {Math.round(talkListenRatio * 100)}%
                              </div>
                              <div className="text-xs text-[#51AF30]">You</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#51AF30] rounded-sm"></div>
                            <div className="text-sm text-[#F0F2F5]">You: {Math.round(talkListenRatio * 100)}%</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#2B2F34] rounded-sm"></div>
                            <div className="text-sm text-[#F0F2F5]">
                              Customer: {Math.round((1 - talkListenRatio) * 100)}%
                            </div>
                          </div>
                          <div className="text-xs text-[#51AF30] mt-2">Ideal ratio: 40-60%</div>
                        </div>
                      </div>
                    </div>

                    {/* Filler Words Count */}
                    <div>
                      <h3 className="text-sm font-medium text-[#51AF30] mb-3">Filler Words</h3>
                      <div className="space-y-2">
                        {Object.entries(fillerWords).map(([word, count]) => (
                          <div key={word} className="flex items-center justify-between">
                            <div className="text-sm text-[#F0F2F5] capitalize">{word.replace("_", " ")}</div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-[#2B2F34] h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#51AF30]"
                                  style={{ width: `${Math.min(100, count * 20)}%` }}
                                ></div>
                              </div>
                              <div className="text-sm text-[#51AF30]">{count}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tone & Emotion Summary */}
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-[#51AF30] mb-3">Tone & Emotion</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {Object.entries(toneEmotions).map(([emotion, percentage]) => (
                          <div key={emotion} className="bg-[#1A1D21]/50 rounded-lg p-3 text-center">
                            <div className="text-sm text-[#F0F2F5] capitalize mb-1">{emotion}</div>
                            <div className="text-lg font-bold text-[#51AF30]">{percentage}%</div>
                            <div className="w-full bg-[#2B2F34] h-1 rounded-full mt-2">
                              <div
                                className="h-full bg-[#51AF30] rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="col-span-12 lg:col-span-4">
              {/* AI Recommendations Panel */}
              <Card className="bg-[#1F2328] border-[#2B2F34] mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#F0F2F5] flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-[#51AF30]" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-[#1F2328] rounded-md p-3 border border-[#2B2F34]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-[#51AF30]">{rec.title}</div>
                        <Badge className={getPriorityBadgeColor(rec.priority)}>{rec.priority}</Badge>
                      </div>
                      <div className="text-sm text-[#F0F2F5]">{rec.description}</div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#51AF30] hover:bg-[#2B2F34]">
                          <Zap className="h-3 w-3 mr-1" />
                          Use This
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Profile Overview */}
              <Card className="bg-[#1F2328] border-[#2B2F34] mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#F0F2F5] text-base flex items-center">
                    <User className="mr-2 h-5 w-5 text-[#51AF30]" />
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48&query=business woman"
                        alt={customerData.name}
                      />
                      <AvatarFallback className="bg-[#1A1D21] text-[#51AF30]">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-[#F0F2F5]">{customerData.name}</div>
                      <div className="text-sm text-[#A0A4A8]">{customerData.position}</div>
                      <div className="text-xs text-[#A0A4A8]">{customerData.company}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#A0A4A8]">Deal Size:</div>
                    <div className="text-[#F0F2F5] font-medium">{customerData.dealSize}</div>

                    <div className="text-[#A0A4A8]">Stage:</div>
                    <div className="text-[#F0F2F5]">{customerData.stage}</div>

                    <div className="text-[#A0A4A8]">Last Contact:</div>
                    <div className="text-[#F0F2F5]">{customerData.lastContact}</div>
                  </div>

                  <div className="pt-2 border-t border-[#2B2F34]">
                    <div className="text-sm font-medium mb-2 text-[#F0F2F5]">Known Interests</div>
                    <div className="flex flex-wrap gap-1">
                      {customerData.interests.map((interest, index) => (
                        <Badge key={index} className="bg-[#51AF30]/20 text-[#51AF30] border-[#51AF30]/30">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2B2F34]">
                    <div className="text-sm font-medium mb-2 text-[#F0F2F5]">Known Objections</div>
                    <div className="flex flex-wrap gap-1">
                      {customerData.objections.map((objection, index) => (
                        <Badge key={index} className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                          {objection}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-[#1F2328] border-[#2B2F34]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#F0F2F5] text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full bg-[#51AF30] hover:bg-[#3E8F25] text-white justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Send Proposal
                    </Button>
                    <Button className="w-full bg-[#51AF30] hover:bg-[#3E8F25] text-white justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                    <Button className="w-full bg-[#51AF30] hover:bg-[#3E8F25] text-white justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Email Summary
                    </Button>
                    <Button className="w-full bg-[#51AF30] hover:bg-[#3E8F25] text-white justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Add to CRM
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
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
  detail,
}: {
  title: string
  value: number
  icon: React.ElementType
  trend: "up" | "down" | "stable"
  detail: string
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-[#51AF30]" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-amber-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-400" />
      default:
        return null
    }
  }

  return (
    <Card className="bg-[#1F2328] border-[#2B2F34]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[#A0A4A8]">{title}</div>
          <Icon className="h-5 w-5 text-[#51AF30]" />
        </div>
        <div className="text-3xl font-bold mb-1 text-[#F0F2F5]">{value}%</div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A0A4A8]">{detail}</div>
          <div className="flex items-center">{getTrendIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sentiment chart component
function SentimentChart({ sentimentHistory }: { sentimentHistory: number[] }) {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-[#A0A4A8]">100%</div>
        <div className="text-xs text-[#A0A4A8]">75%</div>
        <div className="text-xs text-[#A0A4A8]">50%</div>
        <div className="text-xs text-[#A0A4A8]">25%</div>
        <div className="text-xs text-[#A0A4A8]">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-[#2B2F34] w-full"></div>
        <div className="border-b border-[#2B2F34] w-full"></div>
        <div className="border-b border-[#2B2F34] w-full"></div>
        <div className="border-b border-[#2B2F34] w-full"></div>
        <div className="border-b border-[#2B2F34] w-full"></div>
      </div>

      {/* Chart line */}
      <div className="absolute inset-0 px-10 py-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Line */}
          <path
            d={`M0,${100 - sentimentHistory[0]} ${sentimentHistory
              .map((value, index) => `L${(index + 1) * 10},${100 - value}`)
              .join(" ")}`}
            fill="none"
            stroke="#51AF30"
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
              stroke="#51AF30"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Event markers */}
      <div className="absolute top-16 left-[30%] w-5 h-5 bg-red-400 rounded-full flex items-center justify-center z-10">
        <span className="text-xs text-white font-bold">!</span>
      </div>
      <div className="absolute top-16 left-[60%] w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center z-10">
        <span className="text-xs text-white font-bold">$</span>
      </div>

      {/* Current sentiment box */}
      <div className="absolute bottom-4 right-4 bg-[#1A1D21]/80 backdrop-blur-sm rounded-md px-3 py-2 border border-[#2B2F34]">
        <div className="text-xs text-[#A0A4A8]">Current Sentiment</div>
        <div className="text-lg font-mono text-[#51AF30]">65%</div>
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-[#A0A4A8]">-5m</div>
        <div className="text-xs text-[#A0A4A8]">-4m</div>
        <div className="text-xs text-[#A0A4A8]">-3m</div>
        <div className="text-xs text-[#A0A4A8]">-2m</div>
        <div className="text-xs text-[#A0A4A8]">-1m</div>
        <div className="text-xs text-[#A0A4A8]">Now</div>
      </div>
    </div>
  )
}
