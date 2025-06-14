"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------------
   TYPES
--------------------------------------------------------------------------------- */

// Existing Tip type kept for future use, but AI-tip logic is no longer active
type Tip = {
  id: number;
  text: string;
  trigger: string[];
  shown: boolean;
  priority: number;
  delay: number;
  addressed: boolean;
};

/* ★ NEW — the storyboard line type */
type ScriptLine = {
  speaker: "user" | "customer";
  text: string;
  timestamp: string; // e.g. "00:23"
  delay: number; // when the line should start (ms from 0)
  sentiment: number; // gauge value *after* this line
  tip?: string; // 1-s pop-tip (John’s turns only)
};

/* ---------------------------------------------------------------------------------
   STORYBOARD (8 lines, ≈28 s)
--------------------------------------------------------------------------------- */

const LISTEN_GUIDE_SCRIPT: ScriptLine[] = [
  {
    speaker: "user",
    text: "Hi Alex, John from Yapp AI—how’s your afternoon?",
    timestamp: "00:00",
    delay: 0,
    sentiment: 60,
  },
  {
    speaker: "customer",
    text: "Honestly? Swamped. Make it quick.",
    timestamp: "00:04",
    delay: 4000,
    sentiment: 35,
  },
  {
    speaker: "user",
    text: "Totally get it—let me give you the one-minute version.",
    timestamp: "00:08",
    delay: 8000,
    sentiment: 50,
    tip: "Show empathy → acknowledge workload",
  },
  {
    speaker: "customer",
    text: "Alright, go.",
    timestamp: "00:12",
    delay: 12000,
    sentiment: 45,
  },
  {
    speaker: "user",
    text: "We cut your call-wrap time by 30 %. Freeing an hour a day—interested?",
    timestamp: "00:15",
    delay: 15000,
    sentiment: 70,
    tip: "Lead with value (time-saver angle)",
  },
  {
    speaker: "customer",
    text: "That’d be great if it’s real.",
    timestamp: "00:20",
    delay: 20000,
    sentiment: 60,
  },
  {
    speaker: "user",
    text: "I’ll email a 2-minute demo now—can we schedule Tuesday to review?",
    timestamp: "00:23",
    delay: 23000,
    sentiment: 82,
    tip: "Offer proof + next step",
  },
  {
    speaker: "customer",
    text: "Tuesday 10 am works. Thanks, John.",
    timestamp: "00:27",
    delay: 27000,
    sentiment: 90,
  },
];

/* ---------------------------------------------------------------------------------
   SATISFACTION GAUGE (unchanged)
--------------------------------------------------------------------------------- */

const SatisfactionGauge = ({ value }: { value: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedValue, setAnimatedValue] = useState(value);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startAnimation = () => {
      const startValue = animatedValue;
      const endValue = value;
      const duration = 250; // ★ faster pop (was 1000 ms)
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue =
          startValue + (endValue - startValue) * easeOutQuart;
        setAnimatedValue(currentValue);
        if (progress < 1) animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    };
    startAnimation();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, animatedValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radius = Math.min(canvas.width, canvas.height) * 0.8;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    // background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = "#2B2F34";
    ctx.lineWidth = 20;
    ctx.stroke();

    // value arc
    const valueAngle =
      startAngle + (endAngle - startAngle) * (animatedValue / 100);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, valueAngle);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (animatedValue >= 80) {
      gradient.addColorStop(0, "#51AF30");
      gradient.addColorStop(1, "#3E8F25");
    } else if (animatedValue >= 60) {
      gradient.addColorStop(0, "#3E8F25");
      gradient.addColorStop(1, "#3E8F25");
    } else if (animatedValue >= 40) {
      gradient.addColorStop(0, "#FFA500");
      gradient.addColorStop(1, "#FF8C00");
    } else {
      gradient.addColorStop(0, "#FF4444");
      gradient.addColorStop(1, "#CC0000");
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.stroke();

    // center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#1F2328";
    ctx.fill();

    // text
    ctx.font = "bold 24px Arial";
    ctx.fillStyle =
      animatedValue >= 80
        ? "#51AF30"
        : animatedValue >= 60
        ? "#3E8F25"
        : animatedValue >= 40
        ? "#FFA500"
        : "#FF4444";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(animatedValue)}%`, centerX, centerY - 10);

    ctx.font = "14px Arial";
    ctx.fillStyle = "#A0A4A8";
    ctx.fillText("Satisfaction", centerX, centerY + 20);
  }, [animatedValue]);

  return (
    <div className="mt-6">
      <canvas ref={canvasRef} className="w-full h-48" />
    </div>
  );
};

/* ---------------------------------------------------------------------------------
   COMPONENT
--------------------------------------------------------------------------------- */

export default function LiveAssist({
  onNavigate,
  currentPage,
}: {
  onNavigate: (page: "dashboard" | "live-assist" | "ai-coach") => void;
  currentPage: "dashboard" | "live-assist" | "ai-coach";
}) {
  const router = useRouter();
  const [recordingTime, setRecordingTime] = useState(0);

  /* ★ state trimmed: activeTips removed */
  const [visibleMessages, setVisibleMessages] = useState<
    Array<{
      id: number;
      speaker: "user" | "customer";
      text: string;
      timestamp: string;
      currentText: string;
      isComplete: boolean;
      sentiment: number; // ★ carry over for gauge
      tip?: string; // ★ optional pop tip
    }>
  >([]);

  const [satisfactionScore, setSatisfactionScore] = useState(50);

  /* ★ NEW — 1-second pop overlay */
  const [popupTip, setPopupTip] = useState<string | null>(null);

  const messageIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageQueueRef = useRef<ScriptLine[]>([]); // ★ typed
  const isProcessingQueueRef = useRef(false);
  const currentMessageIdRef = useRef<number | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  /* ---------- TIMER (now max 30 s) ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 30) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /* ---------- AUDIO WAVE (unchanged) ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let animationFrameId: number;
    const bars = 50;
    const barWidth = canvas.width / bars;
    const barHeights = new Array(bars).fill(0);
    const targetHeights = new Array(bars).fill(0);
    let lastUpdate = 0;
    const updateInterval = 100;

    const drawAudioWave = (ts: number) => {
      if (ts - lastUpdate >= updateInterval) {
        lastUpdate = ts;
        for (let i = 0; i < bars - 1; i++)
          targetHeights[i] = targetHeights[i + 1];
        targetHeights[bars - 1] = Math.random() * (canvas.height * 0.8);
      }
      for (let i = 0; i < bars; i++)
        barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      barHeights.forEach((h, i) => {
        const x = i * barWidth;
        const y = (canvas.height - h) / 2;
        const g = ctx.createLinearGradient(0, y, 0, y + h);
        g.addColorStop(0, "#51AF30");
        g.addColorStop(1, "#3E8F25");
        ctx.fillStyle = g;
        ctx.shadowColor = "#51AF30";
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth - 2, h);
        ctx.shadowBlur = 0;
      });
      animationFrameId = requestAnimationFrame(drawAudioWave);
    };
    animationFrameId = requestAnimationFrame(drawAudioWave);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  /* ---------- QUEUE ---------- */
  const processNextMessage = () => {
    if (messageQueueRef.current.length === 0 || isProcessingQueueRef.current)
      return;
    isProcessingQueueRef.current = true;
    const line = messageQueueRef.current[0];
    const id = messageIdRef.current++;
    setVisibleMessages((prev) => [
      {
        id,
        speaker: line.speaker,
        text: line.text,
        timestamp: line.timestamp,
        currentText: "",
        isComplete: false,
        sentiment: line.sentiment,
        tip: line.tip,
      },
      ...prev,
    ]);
    currentMessageIdRef.current = id;
    messageQueueRef.current = messageQueueRef.current.slice(1);
  };

  /* ---------- INIT (load storyboard) ---------- */
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    messageQueueRef.current = LISTEN_GUIDE_SCRIPT;
    processNextMessage();
    return () => {
      if (processingTimeoutRef.current)
        clearTimeout(processingTimeoutRef.current);
    };
  }, []);

  /* ---------- STREAMING ---------- */
  useEffect(() => {
    const streaming = setInterval(() => {
      setVisibleMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== currentMessageIdRef.current || msg.isComplete)
            return msg;
          const words = msg.text.split(" ");
          const typed = msg.currentText.split(" ").filter((w) => w).length;
          if (typed >= words.length) {
            /* ★ message finished */
            if (processingTimeoutRef.current)
              clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = setTimeout(() => {
              isProcessingQueueRef.current = false;
              currentMessageIdRef.current = null;
              processNextMessage();
            }, 1000);

            /* ★ update gauge */
            setSatisfactionScore(msg.sentiment);

            /* ★ pop-tip for John */
            if (msg.speaker === "user" && msg.tip) {
              setPopupTip(msg.tip);
              setTimeout(() => setPopupTip(null), 1000);
            }

            return { ...msg, isComplete: true };
          }
          return {
            ...msg,
            currentText: (
              msg.currentText +
              (msg.currentText ? " " : "") +
              words[typed]
            ).trim(),
          };
        })
      );
    }, 200);
    return () => clearInterval(streaming);
  }, []);

  /* ---------- SUMMARY (kept) ---------- */
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const areAllMessagesComplete = () =>
    visibleMessages.every((m) => m.isComplete) &&
    messageQueueRef.current.length === 0;

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary(null);
    await new Promise((r) => setTimeout(r, 1500));
    setSummary(`Follow-up set for Tuesday 10:00.\nEmail demo + proof points.`);
    setIsGeneratingSummary(false);
  };

  /* ---------------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------------- */
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
        <h1 className="text-3xl font-bold">Live Assist</h1>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* ---------------- MAIN COLUMN ---------------- */}
          <div className="col-span-12 lg:col-span-8 relative">
            {" "}
            {/* ★ relative for pop-tip */}
            <Card className="bg-[#1F2328] border-[#2B2F34]">
              <CardHeader className="border-b border-[#2B2F34]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#F0F2F5] flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-[#51AF30]" />
                    Live Call Assistant
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#51AF30] animate-pulse"></div>
                    <span className="text-sm font-mono text-[#A0A4A8]">
                      Recording: {formatTime(recordingTime)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* ★ 1-second pop-tip overlay */}
                {popupTip && (
                  <div
                    className="absolute top-4 right-4 bg-[#1A1D21] border border-[#51AF30]/30
                                  text-sm text-[#F0F2F5] px-3 py-2 rounded-lg shadow-lg
                                  animate-fade-in-out"
                  >
                    {popupTip}
                  </div>
                )}

                {/* Audio visualization */}
                <div className="mb-6">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-24 bg-[#1A1D21] rounded-lg border border-[#2B2F34]"
                  />
                </div>

                {/* Live transcription */}
                <div className="space-y-4 mb-6">
                  {visibleMessages.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 ${
                        item.speaker === "user"
                          ? "bg-[#51AF30]/10 border-[#51AF30]/30"
                          : "bg-[#1A1D21] border-[#2B2F34]"
                      } rounded-lg p-3 border`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`text-sm ${
                            item.speaker === "user"
                              ? "bg-[#51AF30]/20 text-[#51AF30]"
                              : "bg-[#1A1D21] text-[#A0A4A8]"
                          }`}
                        >
                          {item.speaker === "user" ? "J" : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#F0F2F5]">
                            {item.speaker === "user" ? "John" : "Alex"}
                          </span>
                          <span className="text-xs text-[#A0A4A8]">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-[#F0F2F5]">
                          {item.currentText}
                          {!item.isComplete &&
                            item.id === currentMessageIdRef.current && (
                              <span className="inline-block w-1 h-4 bg-[#51AF30] ml-1 animate-pulse"></span>
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Generate Summary */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={generateSummary}
                    disabled={!areAllMessagesComplete() || isGeneratingSummary}
                    className="bg-[#51AF30] hover:bg-[#3E8F25] disabled:bg-[#1A1D21] disabled:text-[#A0A4A8]"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </Button>
                </div>

                {/* Summary card */}
                {summary && (
                  <Card className="bg-[#1A1D21] border-[#2B2F34]">
                    <CardHeader className="border-b border-[#2B2F34]">
                      <CardTitle className="text-[#F0F2F5] flex items-center text-base">
                        <MessageSquare className="mr-2 h-5 w-5 text-[#51AF30]" />
                        Call Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-sm text-[#F0F2F5] whitespace-pre-line">
                        {summary}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Satisfaction Gauge */}
              <Card className="bg-[#1F2328] border-[#2B2F34]">
                <CardHeader className="border-b border-[#2B2F34]">
                  <CardTitle className="text-[#F0F2F5] flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-[#51AF30]" />
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <SatisfactionGauge value={satisfactionScore} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
