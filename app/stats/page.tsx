"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, BarChart3, CheckCircle, XCircle, HelpCircle, TrendingUp, MessageSquare, DollarSign, ListChecks, AlertCircle, Mic, Target, MessageSquareMore, FileText, Brain, Zap, Radio, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale } from 'chart.js'
import { Pie, Line, Bar, Radar } from 'react-chartjs-2'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale)

export default function StatsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    completions: {
      closed: 45,
      nonClosed: 30,
      unknown: 25
    },
    customerSentiment: 75,
    salespersonSentiment: 82,
    fillerWordUsage: 15,
    pipelineValue: 1250000,
    callStructureCompliance: 88,
    objectionHandlingEfficiency: 92,
    questionToTalkRatio: 0.65,
    callStructureComplianceRatio: 0.78,
    fillerWordUsageRatio: 0.32,
    valuePropositionCoverage: 0.85,
    closingLanguageFrequency: 0.72,
    predictiveDealSuccess: 0.68,
    scriptAdherenceScore: 85,
    customerConfusionIndex: 0.15,
    // Add historical data for line charts
    sentimentHistory: {
      customer: [70, 72, 75, 73, 75],
      salesperson: [80, 82, 81, 83, 82]
    },
    // Add data for histogram
    sentimentHeatmap: Array.from({ length: 7 }, () => 
      Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 60)
    ),
    conversationDominance: {
      rep: 65,
      customer: 35
    },
    closeRateTrend: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [45, 52, 48, 55]
    },
    customerTypeDistribution: {
      notInBank: 25,
      existingCustomer: 35,
      formerCustomer: 15,
      hnwi: 10,
      smeBusiness: 15
    },
    toneBalance: {
      enthusiasm: 85,
      authority: 78,
      patience: 92,
      clarity: 88,
      confidence: 80
    }
  })

  // Chart configurations
  const completionsChartData = {
    labels: ['Closed', 'Non-Closed', 'Unknown'],
    datasets: [{
      data: [stats.completions.closed, stats.completions.nonClosed, stats.completions.unknown],
      backgroundColor: ['#22c55e', '#ef4444', '#eab308'],
      borderColor: ['#166534', '#991b1b', '#854d0e'],
      borderWidth: 1,
    }],
  }

  const sentimentChartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Customer Sentiment',
        data: stats.sentimentHistory.customer,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Salesperson Sentiment',
        data: stats.sentimentHistory.salesperson,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const toneBalanceChartData = {
    labels: ['Enthusiasm', 'Authority', 'Patience', 'Clarity', 'Confidence'],
    datasets: [{
      label: 'Tone Balance',
      data: [
        stats.toneBalance.enthusiasm,
        stats.toneBalance.authority,
        stats.toneBalance.patience,
        stats.toneBalance.clarity,
        stats.toneBalance.confidence
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6366f1'
    }]
  }

  const conversationDominanceData = {
    labels: ['Sales Rep', 'Customer'],
    datasets: [{
      data: [stats.conversationDominance.rep, stats.conversationDominance.customer],
      backgroundColor: ['#3b82f6', '#10b981'],
      borderColor: ['#1d4ed8', '#047857'],
      borderWidth: 1,
    }]
  }

  const closeRateTrendData = {
    labels: stats.closeRateTrend.labels,
    datasets: [{
      label: 'Close Rate',
      data: stats.closeRateTrend.values,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }

  const customerTypeChartData = {
    labels: ['Not in the Bank', 'Existing Customer', 'Former Customer', 'HNWI', 'SME/Business Lead'],
    datasets: [{
      label: 'Customer Distribution',
      data: [
        stats.customerTypeDistribution.notInBank,
        stats.customerTypeDistribution.existingCustomer,
        stats.customerTypeDistribution.formerCustomer,
        stats.customerTypeDistribution.hnwi,
        stats.customerTypeDistribution.smeBusiness
      ],
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',  // Indigo
        'rgba(16, 185, 129, 0.7)',  // Green
        'rgba(245, 158, 11, 0.7)',  // Amber
        'rgba(236, 72, 153, 0.7)',  // Pink
        'rgba(59, 130, 246, 0.7)'   // Blue
      ],
      borderColor: [
        '#6366f1',
        '#10b981',
        '#f59e0b',
        '#ec4899',
        '#3b82f6'
      ],
      borderWidth: 1
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#F0F2F5',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: '#2B2F34',
        },
        ticks: {
          color: '#A0A4A8',
        },
      },
      x: {
        grid: {
          color: '#2B2F34',
        },
        ticks: {
          color: '#A0A4A8',
        },
      },
    },
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#2B2F34'
        },
        grid: {
          color: '#2B2F34'
        },
        pointLabels: {
          color: '#F0F2F5'
        },
        ticks: {
          color: '#A0A4A8',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  // Function to get color based on sentiment value
  const getSentimentColor = (value: number) => {
    if (value >= 80) return 'bg-[#51AF30]'
    if (value >= 70) return 'bg-[#3E8F25]'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0F1114] text-[#F0F2F5] p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 text-[#F0F2F5] hover:bg-[#1F2328]"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">Call Analytics Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#51AF30]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Completions Pie Chart */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Completions Distribution</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Pie data={completionsChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      labels: {
                        color: '#F0F2F5'
                      }
                    }
                  }
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Conversation Dominance Meter */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Conversation Dominance</CardTitle>
              <Mic className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Pie data={conversationDominanceData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      labels: {
                        color: '#F0F2F5'
                      }
                    }
                  }
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Close Rate Trend */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Close Rate Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Line data={closeRateTrendData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Customer Type Distribution */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Customer Type Distribution</CardTitle>
              <Users className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Bar 
                  data={customerTypeChartData} 
                  options={{
                    ...chartOptions,
                    indexAxis: 'y' as const,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Tone Balance Radar Chart */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Tone Balance</CardTitle>
              <Radio className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Radar data={toneBalanceChartData} options={radarOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Line Chart */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Sentiment Trends</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <Line data={sentimentChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Heatmap */}
          <Card className="bg-[#1F2328] border-[#2B2F34] col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Sentiment Heatmap</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-1">
                    {/* Header row with hours */}
                    <div className="h-8"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="h-8 flex items-center justify-center text-xs text-[#A0A4A8]">
                        {i}:00
                      </div>
                    ))}
                    
                    {/* Days and sentiment values */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                      <div key={`day-${dayIndex}`} className="contents">
                        <div className="h-8 flex items-center justify-center text-xs text-[#A0A4A8]">
                          {day}
                        </div>
                        {stats.sentimentHeatmap[dayIndex].map((value, hourIndex) => (
                          <div
                            key={`${dayIndex}-${hourIndex}`}
                            className={`h-8 w-8 ${getSentimentColor(value)} rounded-sm flex items-center justify-center text-xs text-[#F0F2F5] font-medium hover:opacity-80 transition-opacity cursor-help`}
                            title={`${day} ${hourIndex}:00 - Score: ${value}`}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completions Stats */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Completions</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#51AF30] mr-2" />
                    <span className="text-sm text-[#F0F2F5]">Closed Deals</span>
                  </div>
                  <Badge variant="secondary" className="bg-[#3E8F25]/20 text-[#51AF30]">
                    {stats.completions.closed}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-[#F0F2F5]">Non-Closed</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    {stats.completions.nonClosed}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-[#F0F2F5]">Unknown</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {stats.completions.unknown}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Sentiment Score */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Customer Sentiment Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.customerSentiment}/100</span>
                  </div>
                  <Progress value={stats.customerSentiment} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Measures customer satisfaction and engagement during calls
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salesperson Sentiment Score */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Salesperson Sentiment Score</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.salespersonSentiment}/100</span>
                  </div>
                  <Progress value={stats.salespersonSentiment} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Evaluates salesperson's tone and communication effectiveness
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filler Word Usage */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Filler Word Usage</CardTitle>
              <AlertCircle className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.fillerWordUsage}/100</span>
                  </div>
                  <Progress value={stats.fillerWordUsage} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Lower score indicates better communication clarity
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Value */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-[#51AF30]">
                  ${stats.pipelineValue.toLocaleString()}
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Total value of deals currently in progress
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Structure Compliance */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Call Structure Compliance</CardTitle>
              <ListChecks className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.callStructureCompliance}/100</span>
                  </div>
                  <Progress value={stats.callStructureCompliance} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Adherence to recommended call structure and flow
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling Efficiency */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Objection Handling Efficiency</CardTitle>
              <AlertCircle className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.objectionHandlingEfficiency}/100</span>
                  </div>
                  <Progress value={stats.objectionHandlingEfficiency} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Effectiveness in addressing and resolving customer objections
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question-to-Talk Ratio */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Question-to-Talk Ratio</CardTitle>
              <Mic className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Ratio</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.questionToTalkRatio.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.questionToTalkRatio * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Balance between questions asked and talking time
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Structure Compliance Ratio */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Call Structure Compliance</CardTitle>
              <Target className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Ratio</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.callStructureComplianceRatio.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.callStructureComplianceRatio * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Adherence to recommended call structure
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filler Word Usage Ratio */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Filler Word Usage</CardTitle>
              <MessageSquareMore className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Ratio</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.fillerWordUsageRatio.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.fillerWordUsageRatio * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Proportion of filler words in conversation
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition Coverage */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Value Proposition Coverage</CardTitle>
              <Target className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Ratio</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.valuePropositionCoverage.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.valuePropositionCoverage * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Coverage of key value propositions during the call
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Closing Language Frequency */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Closing Language Frequency</CardTitle>
              <Zap className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Frequency</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.closingLanguageFrequency.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.closingLanguageFrequency * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Frequency of closing language usage in conversation
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictive Deal Success Probability */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Predictive Deal Success</CardTitle>
              <Brain className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Probability</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.predictiveDealSuccess.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.predictiveDealSuccess * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  AI-predicted probability of deal success
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Script Adherence Score */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Script Adherence Score</CardTitle>
              <FileText className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Score</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.scriptAdherenceScore}/100</span>
                  </div>
                  <Progress value={stats.scriptAdherenceScore} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Adherence to recommended script guidelines
                    </div>
                  </div>
            </CardContent>
          </Card>

          {/* Customer Confusion Index */}
          <Card className="bg-[#1F2328] border-[#2B2F34]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#F0F2F5]">Customer Confusion Index</CardTitle>
              <HelpCircle className="h-4 w-4 text-[#51AF30]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#F0F2F5]">Index</span>
                    <span className="text-sm font-medium text-[#51AF30]">{stats.customerConfusionIndex.toFixed(2)}</span>
                  </div>
                  <Progress value={stats.customerConfusionIndex * 100} className="h-2 bg-[#2B2F34]" />
                </div>
                <div className="text-xs text-[#A0A4A8]">
                  Lower score indicates better customer understanding
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 