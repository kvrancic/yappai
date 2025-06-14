"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* TYPES & SMALL COMPONENTS                                           */
/* ------------------------------------------------------------------ */

type Tip = {
  id: number;
  text: string;
  trigger: string[];
  shown: boolean;
  priority: number;
  delay: number;
  addressed: boolean;
};

const SatisfactionGauge = ({ value }: { value: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedValue, setAnimatedValue] = useState(value);
  const animationRef = useRef<number>();

  /* animate on value change */
  useEffect(() => {
    const startValue = animatedValue;
    const endValue = value;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      setAnimatedValue(startValue + (endValue - startValue) * eased);
      if (t < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () =>
      animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [value]); // eslint-disable-line

  /* draw */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height;
    const r = Math.min(canvas.width, canvas.height) * 0.8;
    const sa = Math.PI;
    const ea = 2 * Math.PI;

    /* background arc */
    ctx.beginPath();
    ctx.arc(cx, cy, r, sa, ea);
    ctx.strokeStyle = "#2B2F34";
    ctx.lineWidth = 20;
    ctx.stroke();

    /* value arc with simple green-orange-red gradient */
    const va = sa + (ea - sa) * (animatedValue / 100);
    ctx.beginPath();
    ctx.arc(cx, cy, r, sa, va);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (animatedValue >= 80) grad.addColorStop(1, "#51AF30");
    else if (animatedValue >= 60) grad.addColorStop(1, "#3E8F25");
    else if (animatedValue >= 40) grad.addColorStop(1, "#FFA500");
    else grad.addColorStop(1, "#FF4444");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 20;
    ctx.stroke();

    /* center disc */
    ctx.beginPath();
    ctx.arc(cx, cy, r - 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#1F2328";
    ctx.fill();

    /* value % text */
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
    ctx.fillText(`${Math.round(animatedValue)}%`, cx, cy - 10);

    /* label */
    ctx.font = "14px Arial";
    ctx.fillStyle = "#A0A4A8";
    ctx.fillText("Satisfaction", cx, cy + 20);
  }, [animatedValue]);

  return (
    <div className="mt-6">
      <canvas ref={canvasRef} className="w-full h-48" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function LiveAssist({
  onNavigate,
  currentPage,
}: {
  onNavigate: (page: "dashboard" | "live-assist" | "ai-coach") => void;
  currentPage: "dashboard" | "live-assist" | "ai-coach";
}) {
  const router = useRouter();

  /* STATE ---------------------------------------------------------- */
  const [recordingTime, setRecordingTime] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<
    Array<{
      id: number;
      speaker: "user" | "customer";
      text: string;
      timestamp: string;
      currentText: string;
      isComplete: boolean;
    }>
  >([]);
  const [activeTips, setActiveTips] = useState<Tip[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [satisfactionScore, setSatisfactionScore] = useState(60); // gauge starts neutral-green
  const messageIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageQueueRef = useRef<
    Array<{
      speaker: "user" | "customer";
      text: string;
      timestamp: string;
      delay: number;
    }>
  >([]);
  const isProcessingQueueRef = useRef(false);
  const currentMessageIdRef = useRef<number | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  /* ----------------------------------------------------------------
     AI TIPS (only texts/triggers/delays updated to match sketch)
  ------------------------------------------------------------------ */
  const allTips: Tip[] = [
    {
      id: 1,
      text: "Show empathy → acknowledge workload",
      trigger: ["swamped", "busy", "quick"],
      shown: false,
      priority: 1,
      delay: 3000, // appears right after the customer's first line
      addressed: false,
    },
    {
      id: 2,
      text: "Lead with value (time-saver angle)",
      trigger: ["go", "alright"],
      shown: false,
      priority: 2,
      delay: 8000,
      addressed: false,
    },
    {
      id: 3,
      text: "Offer proof + propose next step",
      trigger: ["great", "real"],
      shown: false,
      priority: 3,
      delay: 15000,
      addressed: false,
    },
    {
      id: 4,
      text: "Log follow-up in CRM",
      trigger: ["tuesday", "works"],
      shown: false,
      priority: 4,
      delay: 24000,
      addressed: false,
    },
  ];

  /* --------------------------------------------------------------- */
  /* TIP LOGIC (unchanged except uses new allTips)                   */
  /* --------------------------------------------------------------- */
  const checkForNewTips = (message: string, currentTime: number) => {
    const lower = message.toLowerCase();
    const tips = allTips
      .filter((t) => {
        if (t.shown || currentTime < t.delay) return false;
        const should = t.trigger.some((w) => lower.includes(w));
        if (should) {
          const i = allTips.findIndex((x) => x.id === t.id);
          if (i > -1) allTips[i].shown = true;
        }
        return should;
      })
      .sort((a, b) => a.priority - b.priority);

    if (tips.length)
      tips.forEach((tip, idx) =>
        setTimeout(() => {
          setActiveTips((prev) =>
            prev.some((t) => t.id === tip.id)
              ? prev
              : [
                  { ...tip, id: Math.max(0, ...prev.map((t) => t.id)) + 1 },
                  ...prev,
                ]
          );
        }, idx * 1000)
      );
  };

  /* --------------------------------------------------------------- */
  /* SATISFACTION METER (unchanged)                                  */
  /* --------------------------------------------------------------- */
  const calculateSatisfactionScore = (msg: string) => {
    const lower = msg.toLowerCase();
    const pos = [
      "great",
      "interested",
      "yes",
      "good",
      "like",
      "love",
      "excellent",
      "perfect",
    ];
    const neg = ["no", "not", "difficult", "problem", "concern", "worried"];
    const delta =
      (pos.filter((w) => lower.includes(w)).length -
        neg.filter((w) => lower.includes(w)).length) *
      10;
    setSatisfactionScore((p) => Math.min(100, Math.max(0, p + delta)));
  };

  /* --------------------------------------------------------------- */
  /* RECORDING TIMER                                                 */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    const id = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  /* --------------------------------------------------------------- */
  /* AUDIO VISUALISATION (unchanged)                                 */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let frame: number;
    const bars = 50;
    const w = canvas.width / bars;
    const h = new Array(bars).fill(0);
    const tgt = new Array(bars).fill(0);
    let last = 0;
    const interval = 100;

    const draw = (t: number) => {
      if (t - last >= interval) {
        last = t;
        for (let i = 0; i < bars - 1; i++) tgt[i] = tgt[i + 1];
        tgt[bars - 1] = Math.random() * (canvas.height * 0.8);
      }
      for (let i = 0; i < bars; i++) h[i] += (tgt[i] - h[i]) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      h.forEach((val, idx) => {
        const x = idx * w;
        const y = (canvas.height - val) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + val);
        grad.addColorStop(0, "#51AF30");
        grad.addColorStop(1, "#3E8F25");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#51AF30";
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, w - 2, val);
        ctx.shadowBlur = 0;
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => frame && cancelAnimationFrame(frame);
  }, []);

  /* --------------------------------------------------------------- */
  /* MESSAGE QUEUE INITIALISATION (updated to the 8-line sketch)     */
  /* --------------------------------------------------------------- */
  const processNextMessage = () => {
    if (!messageQueueRef.current.length || isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;
    const msg = messageQueueRef.current.shift()!;
    const id = messageIdRef.current++;

    setVisibleMessages((prev) => [
      { id, ...msg, currentText: "", isComplete: false },
      ...prev,
    ]);
    currentMessageIdRef.current = id;
  };

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    /* 30-second “LISTEN & GUIDE” mock transcription ---------------- */
    const script = [
      {
        speaker: "user" as const,
        text: "Hi Alex, John from Yapp AI—how’s your afternoon?",
        timestamp: "00:00",
        delay: 0,
      },
      {
        speaker: "customer" as const,
        text: "Honestly? Swamped. Make it quick.",
        timestamp: "00:04",
        delay: 4000,
      },
      {
        speaker: "user" as const,
        text: "Totally get it—let me give you the one-minute version.",
        timestamp: "00:08",
        delay: 8000,
      },
      {
        speaker: "customer" as const,
        text: "Alright, go.",
        timestamp: "00:12",
        delay: 12000,
      },
      {
        speaker: "user" as const,
        text: "We cut your call-wrap time by 30 %. Freeing an hour a day—interested?",
        timestamp: "00:15",
        delay: 15000,
      },
      {
        speaker: "customer" as const,
        text: "That’d be great if it’s real.",
        timestamp: "00:20",
        delay: 20000,
      },
      {
        speaker: "user" as const,
        text: "I’ll email a 2-minute demo now—can we schedule Tuesday to review?",
        timestamp: "00:23",
        delay: 23000,
      },
      {
        speaker: "customer" as const,
        text: "Tuesday 10 am works. Thanks, John.",
        timestamp: "00:27",
        delay: 27000,
      },
    ];
    messageQueueRef.current = script;
    processNextMessage();
  }, []); // eslint-disable-line

  /* --------------------------------------------------------------- */
  /* STREAMING EFFECT                                                */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    const iv = setInterval(() => {
      setVisibleMessages((prev) =>
        prev.map((m) => {
          if (m.id !== currentMessageIdRef.current || m.isComplete) return m;

          const words = m.text.split(" ");
          const done = m.currentText.trim().split(" ").filter(Boolean).length;

          if (done >= words.length) {
            /* message complete */
            processingTimeoutRef.current &&
              clearTimeout(processingTimeoutRef.current);
            processingTimeoutRef.current = setTimeout(() => {
              isProcessingQueueRef.current = false;
              currentMessageIdRef.current = null;
              processNextMessage();
            }, 1000);

            if (m.speaker === "customer") calculateSatisfactionScore(m.text);
            if (m.speaker === "user")
              setActiveTips((tips) =>
                tips.map((t) =>
                  t.trigger.some((w) => m.text.toLowerCase().includes(w))
                    ? { ...t, addressed: true }
                    : t
                )
              );

            return { ...m, isComplete: true };
          }

          /* type next word */
          const nextWord = words[done];
          const newText = (m.currentText ? m.currentText + " " : "") + nextWord;

          /* tip detection on customer words */
          if (m.speaker === "customer") {
            const [min, sec] = m.timestamp.split(":").map(Number);
            const timeMs = (min * 60 + sec) * 1000;
            checkForNewTips(newText, timeMs);
          }

          return { ...m, currentText: newText };
        })
      );
    }, 200);
    return () => clearInterval(iv);
  }, []); // eslint-disable-line

  /* --------------------------------------------------------------- */
  const allDone = () =>
    visibleMessages.length ===
      messageQueueRef.current.length + visibleMessages.length &&
    visibleMessages.every((m) => m.isComplete);

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummary(null);
    await new Promise((r) => setTimeout(r, 1500));
    setSummary(`Call Summary:
• Customer was swamped, requested brevity
• Rep empathised and promised a one-minute overview
• Key benefit: 30 % reduction in call-wrap time (~1 hr/day saved)
• Customer intrigued but asked for proof
• Rep to email 2-minute demo and proposed Tuesday review
• Follow-up locked in for Tue 10 am → log in CRM`);
    setIsGeneratingSummary(false);
  };

  /* ----------------------------------------------------------------
     RENDER                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0F1114] text-[#F0F2F5] p-6">
      {/* Header ----------------------------------------------------- */}
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
          {/* MAIN PANE ------------------------------------------------ */}
          <div className="col-span-12 lg:col-span-8">
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
                {/* Waveform ----------------------------------------- */}
                <div className="mb-6">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-24 bg-[#1A1D21] rounded-lg border border-[#2B2F34]"
                  />
                </div>

                {/* Transcript --------------------------------------- */}
                <div className="space-y-4 mb-6">
                  {visibleMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-start gap-3 ${
                        m.speaker === "user"
                          ? "bg-[#51AF30]/10"
                          : "bg-[#1A1D21]"
                      } rounded-lg p-3 border ${
                        m.speaker === "user"
                          ? "border-[#51AF30]/30"
                          : "border-[#2B2F34]"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`text-sm ${
                            m.speaker === "user"
                              ? "bg-[#51AF30]/20 text-[#51AF30]"
                              : "bg-[#1A1D21] text-[#A0A4A8]"
                          }`}
                        >
                          {m.speaker === "user" ? "SP" : "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#F0F2F5]">
                            {m.speaker === "user"
                              ? "John (Rep)"
                              : "Alex (Customer)"}
                          </span>
                          <span className="text-xs text-[#A0A4A8]">
                            {m.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-[#F0F2F5]">
                          {m.currentText}
                          {!m.isComplete &&
                            m.id === currentMessageIdRef.current && (
                              <span className="inline-block w-1 h-4 bg-[#51AF30] ml-1 animate-pulse"></span>
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY BUTTON ----------------------------------- */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={generateSummary}
                    disabled={!allDone() || isGeneratingSummary}
                    className="bg-[#51AF30] hover:bg-[#3E8F25] disabled:bg-[#1A1D21] disabled:text-[#A0A4A8]"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Summary...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </Button>
                </div>

                {/* SUMMARY CARD ------------------------------------- */}
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

          {/* SIDEBAR ------------------------------------------------- */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Gauge */}
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

              {/* TIPS */}
              <Card className="bg-[#1F2328] border-[#2B2F34]">
                <CardHeader className="border-b border-[#2B2F34]">
                  <CardTitle className="text-[#F0F2F5] flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-[#51AF30]" />
                    AI Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {activeTips.map((tip) => (
                      <div
                        key={tip.id}
                        className={`bg-[#1A1D21] rounded-lg border ${
                          tip.addressed
                            ? "border-[#2B2F34]"
                            : "border-[#51AF30]/30"
                        } p-3 animate-fade-in`}
                      >
                        <div className="flex items-start gap-2">
                          <Badge
                            variant="outline"
                            className={
                              tip.addressed
                                ? "bg-[#2B2F34] text-[#A0A4A8] border-[#2B2F34]"
                                : "bg-[#51AF30]/20 text-[#51AF30] border-[#51AF30]/30"
                            }
                          >
                            Tip {tip.id}
                          </Badge>
                          <p
                            className={`text-sm ${
                              tip.addressed
                                ? "text-[#A0A4A8]"
                                : "text-[#F0F2F5]"
                            }`}
                          >
                            {tip.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
