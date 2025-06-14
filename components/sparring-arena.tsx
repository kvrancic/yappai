"use client"

import { useState, useEffect, useRef } from "react"
import {
  Zap,
  Headphones,
  Heart,
  Shield,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowLeft,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"

/* ────────────────────────────────────────────────────────────────────────────
  CONSTANTS
──────────────────────────────────────────────────────────────────────────── */
const OTP_GREEN = "#51AF30"
const OTP_GREEN_LIGHT = "#b2ff9e"
const BG_DARK = "#0F1114"
const BG_SURFACE = "#1F2328"
const BG_SURFACE_DARKER = "#1A1D21"
const BORDER_SURFACE = "#2B2F34"

const rankTiers = [
  { name: "Novice", range: "1000–1199", color: "#B67F5E", icon: "🥉" },
  { name: "Intermediate", range: "1200–1399", color: "#A7A7A7", icon: "🥈" },
  { name: "Competent", range: "1400–1599", color: "#FFCC33", icon: "🥇" },
  { name: "Advanced", range: "1600–1799", color: "#33CCFF", icon: "💎" },
  { name: "Expert", range: "1800–1999", color: "#CC33FF", icon: "⭐" },
  { name: "Legend", range: "2000–2200", color: "#FF3366", icon: "👑" },
]

const skills = [
  { id: "speed", name: "Speed", icon: Zap, description: "Improve your response time" },
  { id: "listening", name: "Listening", icon: Headphones, description: "Enhance your active listening skills" },
  { id: "empathy", name: "Empathy", icon: Heart, description: "Develop deeper customer understanding" },
  { id: "compliance", name: "Compliance", icon: Shield, description: "Master regulatory requirements" },
  { id: "tone", name: "Tone", icon: MessageSquare, description: "Perfect your communication style" },
  { id: "closing", name: "Closing", icon: CheckCircle, description: "Convert more opportunities" },
  { id: "objection", name: "Objection Handling", icon: XCircle, description: "Address concerns effectively" },
]

/* ────────────────────────  MOCK ELO DATA  ─────────────────────── */
// Generate more dynamic, non-sinusoidal ELO data
const generateEloHistory = () => {
  const result = []
  let elo = 1250

  for (let i = 0; i < 60; i++) {
    // Create more unpredictable changes
    const change =
      Math.random() > 0.7
        ? Math.floor(Math.random() * 60) - 20 // occasional larger jumps
        : Math.floor(Math.random() * 25) - 10 // smaller regular changes

    elo += change
    // Keep within reasonable bounds
    elo = Math.max(1000, Math.min(2100, elo))

    result.push({
      day: `D${i + 1}`,
      elo: elo,
    })
  }

  return result
}

const eloHistory = generateEloHistory()

/* ────────────────────────────────────────────────────────────────────────────
  MAIN COMPONENT
──────────────────────────────────────────────────────────────────────────── */
export default function SparringArena() {
  /* derived */
  const userElo = eloHistory[eloHistory.length - 1].elo
  const tierFor = (e: number) => {
    if (e >= 2000) return rankTiers[5]
    if (e >= 1800) return rankTiers[4]
    if (e >= 1600) return rankTiers[3]
    if (e >= 1400) return rankTiers[2]
    if (e >= 1200) return rankTiers[1]
    return rankTiers[0]
  }
  const userTier = tierFor(userElo)

  /* state */
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; s: number; o: number }>>([])
  const intRef = useRef<NodeJS.Timeout | null>(null)
  const canStart = selectedSkills.length > 0

  const toggleSkill = (id: string) =>
    setSelectedSkills((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  /* particles */
  useEffect(() => {
    if (!canStart) {
      setParticles([])
      intRef.current && clearInterval(intRef.current)
      return
    }
    setParticles(Array.from({ length: 120 }, (_, i) => ({ id: i, x: 0, y: 0, s: Math.random() * 6 + 3, o: 1 })))
    intRef.current = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          const a = Math.random() * Math.PI * 2
          const sp = Math.random() * 2 + 0.4
          const x = p.x + Math.cos(a) * sp
          const y = p.y + Math.sin(a) * sp
          const o = p.o - 0.01
          return o <= 0 ? { ...p, x: 0, y: 0, o: 1 } : { ...p, x, y, o }
        }),
      )
    }, 22)
    return () => intRef.current && clearInterval(intRef.current)
  }, [canStart])

  /* jsx */
  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: BG_DARK, color: "#F0F2F5" }}>
      {/* Header */}
      <header
        className="w-full border-b px-10 py-4"
        style={{ background: BG_SURFACE_DARKER, borderColor: BORDER_SURFACE }}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-[#A0A4A8] hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Trophy className="h-5 w-5" style={{ color: OTP_GREEN }} />
            <h1 className="text-xl font-semibold">Sparring Arena</h1>
          </div>
          <Badge style={{ background: BG_SURFACE, color: OTP_GREEN, border: `1px solid ${OTP_GREEN}55` }}>
            Training Mode
          </Badge>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-col gap-10 w-full px-10 py-10">
        {/* SKILL SELECTION + START BUTTON - Moved to top */}
        <section className="flex flex-col gap-8 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6" style={{ color: OTP_GREEN }} />
              <h2 className="text-2xl font-semibold">Select Skills to Train</h2>
            </div>
            <Badge
              className="text-base px-4 py-2"
              style={{ background: BG_SURFACE, color: "#A0A4A8", border: `1px solid ${BORDER_SURFACE}` }}
            >
              {selectedSkills.length} Selected
            </Badge>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Skill selection grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((s) => {
                const sel = selectedSkills.includes(s.id)
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSkill(s.id)}
                    className={`rounded-xl border p-4 flex items-center gap-3 cursor-pointer shadow-sm transition-all ${
                      sel
                        ? "ring-2 ring-[#51AF30] bg-[#1A1D21] scale-[1.02]"
                        : "hover:scale-[1.01] hover:ring ring-[#3E8F25]/40"
                    }`}
                    style={{ background: sel ? BG_SURFACE_DARKER : BG_SURFACE, borderColor: BORDER_SURFACE }}
                  >
                    <div className={`p-3 rounded-lg ${sel ? "bg-[#51AF30]/30" : "bg-[#2B2F34]"}`}>
                      <s.icon className={`h-6 w-6 ${sel ? "text-[#51AF30]" : "text-[#A0A4A8]"}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{s.name}</h3>
                      <p className="text-xs text-[#A0A4A8] mt-0.5 line-clamp-1">{s.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Start Sparring button */}
            <div className="flex items-center justify-center lg:w-64">
              <div className="relative">
                {canStart && (
                  <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                      <span
                        key={p.id}
                        className="absolute rounded-full"
                        style={{
                          width: p.s,
                          height: p.s,
                          left: `calc(50% + ${p.x}px)`,
                          top: `calc(50% + ${p.y}px)`,
                          background: OTP_GREEN,
                          opacity: p.o,
                          filter: "blur(1.5px)",
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* pulsating ring */}
                <span className={`absolute inset-0 rounded-full ${canStart ? "animation-pulse" : ""}`}></span>

                <button
                  disabled={!canStart}
                  className={`relative w-48 h-48 rounded-full font-bold flex flex-col items-center justify-center transition-transform ${
                    canStart ? "hover:scale-110 active:scale-95" : "cursor-not-allowed text-[#6E7276]"
                  }`}
                  style={{
                    background: canStart ? "linear-gradient(135deg, #7EE055 0%, #3E8F25 100%)" : BG_SURFACE_DARKER,
                    color: "white",
                    textShadow: "0 0 14px rgba(0,0,0,0.65)",
                  }}
                >
                  <Trophy className="h-10 w-10 mb-2" />
                  <span className="text-center leading-tight tracking-wide text-xl">
                    START
                    <br />
                    SPARRING
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SIMPLIFIED RANK & ELO GRAPH */}
        <section className="flex flex-col gap-8 w-full mt-6">
          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Current ELO and Rank only */}
                <div className="flex flex-col items-center lg:items-start gap-2 lg:w-64">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6" style={{ color: OTP_GREEN }} />
                    <h2 className="text-xl font-semibold text-[#A0A4A8]">Your Progress</h2>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke={BORDER_SURFACE} strokeWidth="6" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={OTP_GREEN}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${((userElo - 1000) / 1200) * 283} 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: OTP_GREEN_LIGHT }}>
                          {userElo}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl">{userTier.icon}</span>
                        <span className="text-xl font-bold" style={{ color: userTier.color }}>
                          {userTier.name}
                        </span>
                      </div>
                      <span className="text-sm text-[#A0A4A8] mt-1">{userTier.range} ELO</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic ELO graph */}
                <div className="flex-1 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eloHistory} margin={{ top: 5, right: 120, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER_SURFACE} />
                      <XAxis
                        dataKey="day"
                        stroke="#6E7276"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval={9}
                      />
                      <YAxis
                        domain={[1000, 2200]}
                        tickCount={7}
                        stroke="#6E7276"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ background: BG_SURFACE_DARKER, border: `1px solid ${BORDER_SURFACE}` }}
                        labelClassName="text-xs"
                      />
                      <Line
                        type="monotone"
                        dataKey="elo"
                        stroke={OTP_GREEN}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: OTP_GREEN_LIGHT }}
                      />
                      {rankTiers.map((t) => {
                        const [min] = t.range.split("–").map(Number)
                        return (
                          <ReferenceLine
                            key={t.name}
                            y={min}
                            stroke={t.color}
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                            strokeOpacity={0.5}
                            label={{
                              value: `${t.icon} ${t.name}`,
                              position: "right",
                              fontSize: 20,
                              fill: t.color,
                              dy: -8,
                              dx: 10,
                            }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PERFORMANCE STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-medium mb-2 text-[#A0A4A8]">Sessions Completed</h3>
                <div className="text-4xl font-bold text-[#51AF30]">24</div>
                <p className="text-sm text-[#A0A4A8] mt-2">Last session: Yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-medium mb-2 text-[#A0A4A8]">Top Skill</h3>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-[#51AF30]" />
                  <span className="text-xl font-bold text-[#F0F2F5]">Compliance</span>
                </div>
                <p className="text-sm text-[#A0A4A8] mt-2">1650 ELO • Advanced</p>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-lg font-medium mb-2 text-[#A0A4A8]">Weekly Progress</h3>
                <div className="text-4xl font-bold text-[#51AF30]">+42</div>
                <p className="text-sm text-[#A0A4A8] mt-2">ELO points gained</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <style jsx global>{`
        @keyframes pulse {
          0%   { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(81, 175, 48, 1); }
          70%  { transform: scale(1);   box-shadow: 0 0 0 60px rgba(81, 175, 48, 0); }
          100% { transform: scale(0.8); }
        }
        .animation-pulse { animation: pulse 2.6s infinite; }
        @keyframes pulse-ring {
          0%   { transform: scale(0.6); opacity: 0.6; }
          80%  { transform: scale(2.6); opacity: 0;   }
          100% { transform: scale(2.6); opacity: 0;   }
        }
      `}</style>
    </div>
  )
}
