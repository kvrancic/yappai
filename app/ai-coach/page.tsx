"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, TrendingUp, Target, Award, BarChart3, Plus, Share2, Settings, ArrowUpRight, ArrowDownRight, Calendar, Trophy } from "lucide-react"
import React, { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SKILLS = [
  { name: "Listening", score: 78, benchmark: 85, delta: +3 },
  { name: "Empathy", score: 92, benchmark: 80, delta: +8 },
  { name: "Compliance", score: 70, benchmark: 75, delta: +2 },
  { name: "Objection Handling", score: 45, benchmark: 72, delta: -12 },
  { name: "Closing", score: 88, benchmark: 90, delta: 0 },
  { name: "Tone", score: 74, benchmark: 80, delta: -2 },
  { name: "Speed", score: 91, benchmark: 88, delta: +1 },
]

const GOAL_TEMPLATES = [
  { id: "close_rate", name: "Close Rate", unit: "%" },
  { id: "deal_size", name: "Average Deal Size", unit: "$" },
  { id: "compliance", name: "Compliance Score", unit: "%" },
  { id: "customer_satisfaction", name: "Customer Satisfaction", unit: "%" },
  { id: "response_time", name: "Response Time", unit: "min" },
]

const GOALS = [
  {
    id: 1,
    title: "Raise Close Rate to 45% by Q3",
    metric: "close_rate",
    current: 37,
    target: 45,
    deadline: "2024-09-30",
    weeklyTrend: [32, 33, 34, 35, 36, 37],
    weeklyDelta: 1.2,
    streak: 3,
    aiTip: "Objection-handling drills improve close rate by 12%",
  },
  {
    id: 2,
    title: "Increase Average Deal Size to $12,500",
    metric: "deal_size",
    current: 10500,
    target: 12500,
    deadline: "2024-08-31",
    weeklyTrend: [9500, 9800, 10000, 10200, 10400, 10500],
    weeklyDelta: 2.4,
    streak: 5,
    aiTip: "Focus on value-based selling to increase deal size",
  },
]

function polarToCartesian(centerX: number, centerY: number, radius: number, angle: number) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  }
}

export default function AICoach({ onNavigate, currentPage }: { onNavigate: (page: "dashboard" | "live-assist" | "ai-coach") => void, currentPage: "dashboard" | "live-assist" | "ai-coach" }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [newGoal, setNewGoal] = useState({
    title: "",
    metric: "",
    current: "",
    target: "",
    stretchTarget: "",
    deadline: "",
  })
  const spokes = SKILLS.length
  const center = 160
  const radius = 120
  const angleStep = (2 * Math.PI) / spokes

  // Calculate points for user and benchmark
  const userPoints = SKILLS.map((s, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (s.score / 100) * radius
    return polarToCartesian(center, center, r, angle)
  })
  const benchmarkPoints = SKILLS.map((s, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (s.benchmark / 100) * radius
    return polarToCartesian(center, center, r, angle)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const calculateTimeLeft = (deadline: string) => {
    const now = new Date()
    const end = new Date(deadline)
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="container mx-auto">
        {/* Main content area with radar and momentum */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Main content */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Cpu className="mr-2 h-5 w-5 text-cyan-500" />
                    Skills Radar
                  </CardTitle>
                  <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50">
                    Last updated: 2h ago
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <svg width={320} height={320} viewBox="0 0 400 400">
                      {/* Radar spokes */}
                      {SKILLS.map((s, i) => {
                        const angle = i * angleStep - Math.PI / 2
                        const end = polarToCartesian(200, 200, radius, angle)
                        const labelDistance = radius * 1.35
                        const labelX = 200 + labelDistance * Math.cos(angle)
                        const labelY = 200 + labelDistance * Math.sin(angle)
                        
                        return (
                          <g key={s.name}>
                            <line
                              x1={200}
                              y1={200}
                              x2={end.x}
                              y2={end.y}
                              stroke="#334155"
                              strokeWidth={2}
                            />
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs fill-slate-400"
                            >
                              {s.name}
                            </text>
                          </g>
                        )
                      })}
                      {/* Radar grid circles */}
                      {[0.25, 0.5, 0.75, 1].map((f, idx) => (
                        <circle
                          key={idx}
                          cx={200}
                          cy={200}
                          r={radius * f}
                          fill="none"
                          stroke="#334155"
                          strokeDasharray={idx === 3 ? "4 4" : undefined}
                          strokeWidth={1}
                        />
                      ))}
                      {/* Team benchmark ghost-line */}
                      <polygon
                        points={benchmarkPoints.map(p => `${p.x + 40},${p.y + 40}`).join(" ")}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        opacity={0.5}
                      />
                      {/* User score area */}
                      <polygon
                        points={userPoints.map(p => `${p.x + 40},${p.y + 40}`).join(" ")}
                        fill="#22d3ee33"
                        stroke="#22d3ee"
                        strokeWidth={3}
                      />
                      {/* Dots for hover */}
                      {userPoints.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x + 40}
                          cy={p.y + 40}
                          r={hovered === i ? 10 : 6}
                          fill={hovered === i ? "#38bdf8" : "#22d3ee"}
                          stroke="#fff"
                          strokeWidth={hovered === i ? 3 : 2}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                        />
                      ))}
                    </svg>
                    {/* Tooltip for hovered skill */}
                    {hovered !== null && (
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          transform: `translate(-50%, -50%) translate(${userPoints[hovered].x - center}px, ${userPoints[hovered].y - center - 30}px)`
                        }}
                      >
                        <div className="bg-slate-800/90 border border-cyan-500/40 rounded-lg px-4 py-2 shadow-xl text-center min-w-[120px]">
                          <div className="font-semibold text-cyan-300 text-lg">{SKILLS[hovered].name}</div>
                          <div className="text-slate-100 text-xl font-bold">{SKILLS[hovered].score}</div>
                          <div className="text-slate-400 text-sm">Team: {SKILLS[hovered].benchmark}</div>
                          <div className={`text-sm font-mono ${SKILLS[hovered].delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {SKILLS[hovered].delta >= 0 ? "+" : ""}{SKILLS[hovered].delta} last 30d
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Momentum Card */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm mt-6">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-slate-100 flex items-center text-base">
                  <TrendingUp className="mr-2 h-5 w-5 text-cyan-500" />
                  Momentum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                  {SKILLS.map((skill) => (
                    <div 
                      key={skill.name} 
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                        skill.delta >= 0 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      <span>{skill.name}</span>
                      <span className="font-mono">
                        {skill.delta >= 0 ? '↑' : '↓'}{Math.abs(skill.delta)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-6">
              {/* Legend */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <Target className="mr-2 h-5 w-5 text-cyan-500" />
                    Legend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500/30 border border-cyan-500"></div>
                      <span className="text-sm text-slate-400">Your Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-dashed border-cyan-500"></div>
                      <span className="text-sm text-slate-400">Team Average</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                      <span className="text-sm text-slate-400">Grid Lines</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <BarChart3 className="mr-2 h-5 w-5 text-cyan-500" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-1">Top Skill</div>
                      <div className="text-lg font-bold text-cyan-400">Speed</div>
                      <div className="text-sm text-slate-500">91% score</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-sm text-slate-400 mb-1">Needs Improvement</div>
                      <div className="text-lg font-bold text-amber-400">Objection Handling</div>
                      <div className="text-sm text-slate-500">65% score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Full-width AI Suggestions section */}
        <div className="w-full">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-slate-100 flex items-center text-base">
                <Cpu className="mr-2 h-5 w-5 text-cyan-500" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Objection Handling Suggestions */}
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <h3 className="font-medium text-slate-200">Objection Handling</h3>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                      +5 points reward
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="https://www.youtube.com/watch?v=9jNdyq-jkhI" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-16 h-9 rounded overflow-hidden bg-slate-700 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=160&h=90&fit=crop&auto=format" 
                          alt="Mastering Objection Handling"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0.5 right-0.5">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">How To Overcome Any Sales Objections</div>
                        <div className="text-xs text-slate-400">Internal Training • 15 min</div>
                      </div>
                      <div className="text-xs text-slate-500">Watch →</div>
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-16 h-9 rounded overflow-hidden bg-slate-700 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&h=90&fit=crop&auto=format" 
                          alt="Common Objections & Responses"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0.5 right-0.5">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">Common Objections & Responses</div>
                        <div className="text-xs text-slate-400">YouTube • 12 min</div>
                      </div>
                      <div className="text-xs text-slate-500">Watch →</div>
                    </a>
                  </div>
                </div>

                {/* Tone Suggestions */}
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <h3 className="font-medium text-slate-200">Tone</h3>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                      +3 points reward
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="#" 
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-16 h-9 rounded overflow-hidden bg-slate-700 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=90&fit=crop&auto=format" 
                          alt="Professional Communication Tone"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0.5 right-0.5">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200">Professional Communication Tone</div>
                        <div className="text-xs text-slate-400">Internal Training • 10 min</div>
                      </div>
                      <div className="text-xs text-slate-500">Watch →</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Points Summary */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">Total Points Available</div>
                  <div className="text-lg font-bold text-cyan-400">8 points</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Watch all suggested videos to earn points and improve your skills
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Tracker Section */}
        <div className="w-full mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-100 flex items-center text-base">
                  <Trophy className="mr-2 h-5 w-5 text-cyan-500" />
                  Goal Tracker
                </CardTitle>
                <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20">
                      <Plus className="mr-2 h-4 w-4" />
                      New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-slate-100">Create New Goal</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Set a new performance goal to track your progress
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Goal Template</Label>
                        <Select onValueChange={setSelectedTemplate}>
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {GOAL_TEMPLATES.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Goal Title</Label>
                        <Input 
                          className="bg-slate-800 border-slate-700"
                          placeholder="e.g., Raise Close Rate to 45% by Q3"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Current Value</Label>
                          <Input 
                            className="bg-slate-800 border-slate-700"
                            placeholder="Current value"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Target Value</Label>
                          <Input 
                            className="bg-slate-800 border-slate-700"
                            placeholder="Target value"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Deadline</Label>
                        <Input 
                          type="date"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewGoalModal(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-cyan-500 hover:bg-cyan-600">
                        Create Goal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOALS.map((goal) => (
                  <div key={goal.id} className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-slate-200">{goal.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-slate-700/50 text-slate-300">
                            {goal.streak} week streak
                          </Badge>
                          <Badge variant="outline" className={`${
                            goal.weeklyDelta >= 0 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {goal.weeklyDelta >= 0 ? '↑' : '↓'}{Math.abs(goal.weeklyDelta)}% this week
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-cyan-400">
                          {goal.current}{GOAL_TEMPLATES.find(t => t.id === goal.metric)?.unit}
                        </div>
                        <div className="text-sm text-slate-400">
                          Target: {goal.target}{GOAL_TEMPLATES.find(t => t.id === goal.metric)?.unit}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300">{calculateProgress(goal.current, goal.target).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={calculateProgress(goal.current, goal.target)} 
                          className="h-2 bg-slate-700 [&>div]:bg-green-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span>{goal.id === 1 ? '15 days left' : '28 days left'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/50">
                        <div className="text-sm text-slate-400 mb-2">AI Tip</div>
                        <div className="text-sm text-slate-300">{goal.aiTip}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 