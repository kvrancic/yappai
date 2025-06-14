"use client"

import { useState } from "react"
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  MapPin,
  Globe,
  Calendar,
  Star,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

/* ────────────────────────────────────────────────────────────────────────────
  CONSTANTS
──────────────────────────────────────────────────────────────────────────── */
const OTP_GREEN = "#51AF30"
const OTP_GREEN_LIGHT = "#b2ff9e"
const BG_DARK = "#0F1114"
const BG_SURFACE = "#1F2328"
const BG_SURFACE_DARKER = "#1A1D21"
const BORDER_SURFACE = "#2B2F34"

// Employee avatar images
const avatarImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
]

// Mock leaderboard data
const generateLeaderboardData = (location: string, period: string) => {
  const names = [
    "Sarah Johnson",
    "Michael Chen",
    "Emma Williams",
    "David Kumar",
    "Lisa Anderson",
    "James Wilson",
    "Maria Garcia",
    "Robert Taylor",
    "Jennifer Lee",
    "William Brown",
    "Patricia Davis",
    "Christopher Moore",
    "Linda Martinez",
    "Daniel Jackson",
    "Barbara Thomas",
    "Joseph White",
    "Susan Harris",
    "Thomas Clark",
    "Karen Lewis",
    "Mark Robinson",
  ]

  // Cities in Croatia, Hungary, and Slovenia where OTP operates
  const cities = [
    "Budapest",
    "Debrecen",
    "Szeged",
    "Pécs",
    "Győr", // Hungary
    "Zagreb",
    "Split",
    "Rijeka",
    "Osijek",
    "Zadar", // Croatia
    "Ljubljana",
    "Maribor",
    "Celje",
    "Kranj",
    "Koper", // Slovenia
    "Bratislava",
    "Košice", // Slovakia
    "Bucharest",
    "Cluj-Napoca", // Romania
    "Sofia",
    "Plovdiv", // Bulgaria
    "Belgrade",
    "Novi Sad", // Serbia
    "Podgorica", // Montenegro
    "Tirana", // Albania
    "Chișinău", // Moldova
  ]

  const countries = [
    "Hungary",
    "Croatia",
    "Slovenia",
    "Slovakia",
    "Romania",
    "Bulgaria",
    "Serbia",
    "Montenegro",
    "Albania",
    "Moldova",
  ]

  return names.map((name, index) => {
    const baseElo = 2100 - index * 35 - Math.floor(Math.random() * 20)
    const previousRank = index + 1 + Math.floor(Math.random() * 5) - 2
    const rankChange = previousRank - (index + 1)
    const winRate = 85 - index * 2 + Math.floor(Math.random() * 10)
    const sessionsCompleted = 150 - index * 5 + Math.floor(Math.random() * 20)

    return {
      rank: index + 1,
      name,
      avatar: avatarImages[Math.floor(Math.random() * avatarImages.length)],
      elo: Math.max(1000, baseElo),
      previousRank,
      rankChange,
      winRate,
      sessionsCompleted,
      topSkill: ["Closing", "Objection Handling", "Empathy", "Compliance", "Tone"][Math.floor(Math.random() * 5)],
      city: cities[Math.floor(Math.random() * cities.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      streak: Math.floor(Math.random() * 15) + 1,
    }
  })
}

/* ────────────────────────────────────────────────────────────────────────────
  MAIN COMPONENT
──────────────────────────────────────────────────────────────────────────── */
export default function Leaderboard() {
  const [locationFilter, setLocationFilter] = useState<"city" | "country" | "all">("city")
  const [periodFilter, setPeriodFilter] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null)

  // Get current user data (mock)
  const currentUser = {
    rank: 12,
    name: "John Parker",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg",
    elo: 1687,
    previousRank: 15,
    rankChange: 3,
    winRate: 72,
    sessionsCompleted: 89,
    topSkill: "Compliance",
    city: "Budapest",
    country: "Hungary",
    streak: 7,
  }

  // Generate leaderboard data based on filters
  const leaderboardData = generateLeaderboardData(locationFilter, periodFilter)

  // Insert current user into the data if not in top 20
  const displayData =
    currentUser.rank > 20
      ? [...leaderboardData.slice(0, 10), currentUser, ...leaderboardData.slice(10, 19)]
      : leaderboardData

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-[#51AF30]" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Minus className="h-4 w-4 text-[#A0A4A8]" />
  }

  const getLocationLabel = () => {
    switch (locationFilter) {
      case "city":
        return "Budapest"
      case "country":
        return "Hungary"
      case "all":
        return "Global"
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1114] text-[#F0F2F5]">
      {/* Header */}
      <header
        className="w-full border-b px-6 py-4"
        style={{ background: BG_SURFACE_DARKER, borderColor: BORDER_SURFACE }}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-[#A0A4A8] hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Trophy className="h-6 w-6" style={{ color: OTP_GREEN }} />
            <h1 className="text-2xl font-semibold">Leaderboard</h1>
            <Badge style={{ background: BG_SURFACE, color: OTP_GREEN, border: `1px solid ${OTP_GREEN}55` }}>
              {getLocationLabel()} • {periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="advanced-filters" checked={showAdvancedFilters} onCheckedChange={setShowAdvancedFilters} />
              <Label htmlFor="advanced-filters" className="text-sm text-[#A0A4A8] cursor-pointer">
                Advanced Filters
              </Label>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        {/* Filter Tabs */}
        <div className="mb-6">
          <Tabs value={locationFilter} onValueChange={(v) => setLocationFilter(v as any)}>
            <TabsList className="bg-[#1F2328] border border-[#2B2F34]">
              <TabsTrigger value="city" className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                City
              </TabsTrigger>
              <TabsTrigger value="country" className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />
                Country
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white">
                <Star className="h-4 w-4 mr-2" />
                All Regions
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <Tabs value={periodFilter} onValueChange={(v) => setPeriodFilter(v as any)}>
              <TabsList className="bg-[#1F2328] border border-[#2B2F34]">
                <TabsTrigger value="weekly" className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="data-[state=active]:bg-[#51AF30] data-[state=active]:text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Card className="mt-4" style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm text-[#A0A4A8]">Filter by Skill:</Label>
                  <div className="flex gap-2">
                    {["Closing", "Objection Handling", "Empathy", "Compliance", "Tone"].map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? null : skill)}
                        className={`border-[#2B2F34] ${
                          selectedSkillFilter === skill
                            ? "bg-[#51AF30] text-white border-[#51AF30]"
                            : "text-[#A0A4A8] hover:text-white hover:bg-[#2B2F34]"
                        }`}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Your Position Card */}
        <Card className="mb-6" style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-[#51AF30]">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                    <AvatarFallback className="bg-[#1A1D21] text-[#51AF30]">JP</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-2 -right-2 bg-[#51AF30] text-white border-0">
                    #{currentUser.rank}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Your Position</h3>
                  <p className="text-sm text-[#A0A4A8]">
                    {currentUser.city} • {currentUser.topSkill} Specialist
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#51AF30]">{currentUser.elo}</div>
                  <div className="text-xs text-[#A0A4A8]">ELO Score</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    {getRankChangeIcon(currentUser.rankChange)}
                    <span
                      className={`text-lg font-bold ${
                        currentUser.rankChange > 0
                          ? "text-[#51AF30]"
                          : currentUser.rankChange < 0
                            ? "text-red-400"
                            : "text-[#A0A4A8]"
                      }`}
                    >
                      {Math.abs(currentUser.rankChange)}
                    </span>
                  </div>
                  <div className="text-xs text-[#A0A4A8]">Rank Change</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.winRate}%</div>
                  <div className="text-xs text-[#A0A4A8]">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-[#51AF30]" />
                    <span className="text-lg font-bold text-white">{currentUser.streak}</span>
                  </div>
                  <div className="text-xs text-[#A0A4A8]">Day Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#51AF30]">2,847</div>
                  <div className="text-sm text-[#A0A4A8]">Active Players</div>
                </div>
                <Trophy className="h-8 w-8 text-[#51AF30] opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">1,687</div>
                  <div className="text-sm text-[#A0A4A8]">Average ELO</div>
                </div>
                <Medal className="h-8 w-8 text-[#51AF30] opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">68%</div>
                  <div className="text-sm text-[#A0A4A8]">Avg Win Rate</div>
                </div>
                <ChevronUp className="h-8 w-8 text-[#51AF30] opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">12,456</div>
                  <div className="text-sm text-[#A0A4A8]">Total Sessions</div>
                </div>
                <Zap className="h-8 w-8 text-[#51AF30] opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card style={{ background: BG_SURFACE, borderColor: BORDER_SURFACE }}>
          <CardHeader className="border-b" style={{ borderColor: BORDER_SURFACE }}>
            <CardTitle className="text-lg text-white">
              Top Performers • {getLocationLabel()} • {periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: BORDER_SURFACE }}>
                    <th className="text-left p-4 text-sm font-medium text-[#A0A4A8]">Rank</th>
                    <th className="text-left p-4 text-sm font-medium text-[#A0A4A8]">Player</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">ELO</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">Change</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">Win Rate</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">Sessions</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">Top Skill</th>
                    <th className="text-center p-4 text-sm font-medium text-[#A0A4A8]">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((player, index) => {
                    const isCurrentUser = player.name === currentUser.name
                    const rankIcon = getRankIcon(player.rank)

                    return (
                      <tr
                        key={index}
                        className={`border-b transition-colors ${
                          isCurrentUser ? "bg-[#51AF30]/10" : "hover:bg-[#2B2F34]/50"
                        }`}
                        style={{ borderColor: BORDER_SURFACE }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {rankIcon ? (
                              <span className="text-2xl">{rankIcon}</span>
                            ) : (
                              <span className={`text-lg font-bold ${isCurrentUser ? "text-[#51AF30]" : "text-white"}`}>
                                #{player.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-10 w-10 ${isCurrentUser ? "border-2 border-[#51AF30]" : ""}`}>
                              <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                              <AvatarFallback className="bg-[#1A1D21] text-[#51AF30]">
                                {player.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className={`font-medium ${isCurrentUser ? "text-[#51AF30]" : "text-white"}`}>
                                {player.name} {isCurrentUser && "(You)"}
                              </div>
                              <div className="text-xs text-[#A0A4A8]">
                                {player.city}, {player.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-lg font-bold text-white">{player.elo}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            {getRankChangeIcon(player.rankChange)}
                            <span
                              className={`font-medium ${
                                player.rankChange > 0
                                  ? "text-[#51AF30]"
                                  : player.rankChange < 0
                                    ? "text-red-400"
                                    : "text-[#A0A4A8]"
                              }`}
                            >
                              {Math.abs(player.rankChange)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-medium text-white">{player.winRate}%</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[#A0A4A8]">{player.sessionsCompleted}</span>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="border-[#2B2F34] text-[#51AF30]">
                            {player.topSkill}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Zap className="h-3 w-3 text-[#51AF30]" />
                            <span className="text-sm text-white">{player.streak}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
