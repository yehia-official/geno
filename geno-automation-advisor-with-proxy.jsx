import { useState, useRef, useEffect } from "react";
import {
  Zap,
  GitBranch,
  Cog,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Mail,
  Rocket,
  Layers,
  MessageCircle,
  Linkedin,
  X,
  Quote,
} from "lucide-react";

// TODO: replace with GENO's real WhatsApp number (country code, no + or spaces)
const WHATSAPP_NUMBER = "201000000000";

const NODE_STYLES = {
  trigger: { color: "#00E7FF", icon: Zap },
  logic: { color: "#8DF7FF", icon: GitBranch },
  action: { color: "#7A5CFF", icon: Cog },
};

const CATEGORIES = ["All", "E-commerce", "Content", "Customer Support", "Sales", "Operations"];

const CASE_STUDIES = {
  "E-commerce": "ساعدنا متجر إلكتروني ناشئ يوقف تحديث المخزون يدويًا بين المتجر ومنصات البيع — من حوالي 10 ساعات أسبوعيًا لأقل من ساعة.",
  Content: "بنينا لصانع محتوى نظام ينشر نفس المحتوى تلقائيًا على 4 منصات بعد كل حلقة، بدل النسخ واللصق يدويًا.",
  "Customer Support": "أتمتنا الرد على الأسئلة المتكررة لشركة ناشئة، وقللنا وقت أول رد من ساعات لدقايق معدودة.",
  Sales: "لعميل ناشئ، ربطنا الفورم بالـ CRM تلقائيًا فورًا، ووقفنا فقدان أي عميل محتمل.",
  Operations: "أتمتنا عملية تجهيز الموظف الجديد لشركة صغيرة من 6 خطوات يدوية متفرقة لخطوة واحدة.",
  Other: "بنينا نظام أتمتة مخصص لعميل بمشكلة مشابهة، ووفرنا عليه ساعات من الشغل اليدوي كل أسبوع.",
};

const TIMELINE = {
  quick: [
    { label: "مكالمة تعريفية", detail: "نفس الأسبوع" },
    { label: "بناء الأتمتة", detail: "3-5 أيام" },
    { label: "متابعة بعد التسليم", detail: "شهر كامل مجانًا" },
  ],
  full: [
    { label: "مكالمة تعريفية", detail: "نفس الأسبوع" },
    { label: "بناء الأتمتة", detail: "1-3 أسابيع" },
    { label: "متابعة بعد التسليم", detail: "شهر كامل مجانًا" },
  ],
};

const TESTIMONIALS = [
  { name: "محمود عبد الرحمن", role: "صاحب متجر إلكتروني", quote: "وفّرلي ساعتين يوميًا كنت بضيّعهم في متابعة الطلبات يدويًا. الأتمتة اشتغلت من أول أسبوع." },
  { name: "سارة يوسف", role: "مؤسسة startup ناشئة", quote: "كنت خايفة الأتمتة تبقى معقدة، لكن التنفيذ كان واضح وسريع والمتابعة بعدها كانت مطمّنة جدًا." },
  { name: "Karim H.", role: "E-commerce founder", quote: "Cut our manual order processing time by more than half in the first month. Worth every penny." },
];

const PRICE_NOTE = "بداية من ٥٠٠٠ جنيه حسب حجم المشروع";

const EXAMPLES = [
  { cat: "Customer Support", text: "برد على رسايل العملاء على انستجرام يدويًا كل يوم وده بياخد وقت كتير" },
  { cat: "Sales", text: "We manually copy leads from a Google Form into a CRM every day" },
  { cat: "Content", text: "بجمع بيانات المنافسين يدويًا كل أسبوع من مواقعهم" },
  { cat: "E-commerce", text: "براجع طلبات الشحن يدويًا وبكلم شركة الشحن واحد واحد" },
  { cat: "Content", text: "I manually reformat and post the same blog content across 4 social platforms" },
  { cat: "Customer Support", text: "الأسئلة المتكررة بترد عليها إنسان بدل ما تتحل أوتوماتيك" },
  { cat: "Sales", text: "بعمل follow-up يدوي بالإيميل لكل عميل محتمل بعد الديمو" },
  { cat: "Operations", text: "Every new hire needs 6 manual steps across 4 different tools" },
  { cat: "E-commerce", text: "بحدّث المخزون يدويًا على الموقع وعلى فيسبوك ماركت بليس بشكل منفصل" },
  { cat: "Content", text: "بكتب نفس الملخص يدويًا لكل حلقة بودكاست عشان أنشره كبوست" },
  { cat: "Operations", text: "Weekly reports get compiled by hand from 3 separate spreadsheets" },
  { cat: "Sales", text: "بصنّف العملاء المحتملين يدويًا حسب جديتهم قبل ما أكلمهم" },
  { cat: "Customer Support", text: "لازم أتابع تذاكر الدعم يدويًا عشان محدش ينسى يرد" },
  { cat: "E-commerce", text: "New orders trigger nothing automatically — I check email all day" },
  { cat: "Operations", text: "بعمل invoice يدوي لكل عميل آخر الشهر واحد واحد" },
  { cat: "Content", text: "I manually schedule and caption every Instagram post one by one" },
];

export default function GenoAutomationAdvisor() {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [plan, setPlan] = useState(null);
  const [track, setTrack] = useState("quick"); // quick | full
  const [revealCount, setRevealCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [barsIn, setBarsIn] = useState(false);
  const [popular, setPopular] = useState(null);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [exitShown, setExitShown] = useState(false);

  useEffect(() => {
    function handleMouseOut(e) {
      if (e.clientY <= 0 && plan && !leadSent && !exitShown) {
        setShowExit(true);
        setExitShown(true);
      }
    }
    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [plan, leadSent, exitShown]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("category-counts", true);
        if (res?.value) setPopular(JSON.parse(res.value));
      } catch (e) {
        // no data yet — fine
      }
    })();
  }, []);

  useEffect(() => {
    if (status !== "done" || !plan) return;
    const nodes = plan.tracks[track]?.nodes || [];
    setRevealCount(0);
    setBarsIn(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealCount(i);
      if (i >= nodes.length) {
        clearInterval(id);
        setTimeout(() => setBarsIn(true), 150);
      }
    }, 240);
    return () => clearInterval(id);
  }, [status, plan, track]);

  async function logCategory(category) {
    try {
      const existing = await window.storage.get("category-counts", true);
      const counts = existing?.value ? JSON.parse(existing.value) : {};
      counts[category] = (counts[category] || 0) + 1;
      await window.storage.set("category-counts", JSON.stringify(counts), true);
      setPopular(counts);
    } catch (e) {
      // storage best-effort — ignore failures
    }
  }

  async function runAdvisor(problem) {
    if (!problem.trim()) return;
    setStatus("loading");
    setPlan(null);
    setCopied(false);
    setLeadSent(false);
    setLeadName("");
    setLeadContact("");

    const system = `You are the automation advisor embedded in GENO's website, an AI automation studio. A visitor describes a repetitive business problem, in Arabic or English. Design two realistic n8n-style automation workflows that solve it: a cheap/simple "quick" version and a more complete "full" version.

Respond in the SAME language the user wrote in (Arabic or English) for all text fields. Return ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:

{
  "summary": "one short sentence reframing their problem as an automatable workflow",
  "category": "one of: E-commerce, Content, Customer Support, Sales, Operations, Other",
  "manualHoursPerWeek": number (realistic current hours/week spent on this manually),
  "automatedHoursPerWeek": number (realistic remaining hours/week after automation, can be near 0),
  "tracks": {
    "quick": {
      "label": "short label for this track (e.g. 'Quick win' or 'الحل السريع')",
      "nodes": [ {"type": "trigger|logic|action", "title": "short node name (2-4 words)", "tool": "specific n8n node or integration name", "description": "one short sentence"} ]
    },
    "full": {
      "label": "short label (e.g. 'Full automation' or 'الحل الكامل')",
      "nodes": [ {"type": "trigger|logic|action", "title": "...", "tool": "...", "description": "..."} ]
    }
  }
}

Rules: "quick" has 3-4 nodes using minimal/free tools. "full" has 5-7 nodes, more robust, first node in both must be type "trigger". Keep every field concise — this renders in small UI cards.`;

    try {
      // بيكلم backend proxy بتاعنا بدل ما يكلم Anthropic مباشرة —
      // الـ API key بيفضل مخفي على السيرفر وميوصلش لمتصفح الزائر
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      if (!response.ok) {
        throw new Error("request failed");
      }
      const parsed = await response.json();
      if (!parsed.tracks?.quick?.nodes?.length || !parsed.tracks?.full?.nodes?.length) {
        throw new Error("bad shape");
      }
      setPlan(parsed);
      setTrack("quick");
      setStatus("done");
      logCategory(CATEGORIES.includes(parsed.category) ? parsed.category : "Operations");
    } catch (e) {
      setStatus("error");
    }
  }

  function copyPlan() {
    if (!plan) return;
    const t = plan.tracks[track];
    const lines = [
      `GENO Automation Plan — ${t.label}`,
      plan.summary,
      "",
      ...t.nodes.map((n, i) => `${i + 1}. [${n.type}] ${n.title} (${n.tool}) — ${n.description}`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isRTL = /[\u0600-\u06FF]/.test(input);
  const filteredExamples = filter === "All" ? EXAMPLES : EXAMPLES.filter((e) => e.cat === filter);
  const currentNodes = plan?.tracks?.[track]?.nodes || [];
  const maxHours = plan ? Math.max(plan.manualHoursPerWeek, plan.automatedHoursPerWeek, 1) : 1;
  const topCategory = popular
    ? Object.entries(popular).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Inter:wght@400;500&display=swap');
        .geno-display { font-family: 'Space Grotesk', sans-serif; }
        .geno-ui { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes flow { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .geno-node { animation: riseIn 0.5s ease forwards; }
        .geno-chip:hover { border-color: rgba(0,231,255,0.5) !important; background: rgba(0,231,255,0.06) !important; }
        .geno-cat.active { background: rgba(0,231,255,0.12) !important; border-color: #00E7FF !important; color: #00E7FF !important; }
        .geno-track:hover { border-color: rgba(255,255,255,0.25) !important; }
        .geno-track.active { border-color: #00E7FF !important; background: rgba(0,231,255,0.06) !important; }
        textarea::placeholder { color: #6b7280; }
        textarea:focus { outline: none; border-color: rgba(0,231,255,0.5) !important; box-shadow: 0 0 0 3px rgba(0,231,255,0.08); }
        .geno-bar-fill { transition: width 1s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      {showExit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "20px",
          }}
          onClick={() => setShowExit(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(0,231,255,0.3)",
              borderRadius: "16px",
              padding: "26px",
              maxWidth: "360px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowExit(false)}
              style={{ position: "absolute", top: "12px", left: "12px", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={16} color="#6b7280" />
            </button>
            <p className="geno-ui" style={{ fontSize: "12px", color: "#00E7FF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              قبل ما تمشي
            </p>
            <h3 className="geno-display" style={{ fontSize: "19px", fontWeight: 700, margin: "0 0 10px" }}>
              هتسيب الخطة دي من غير ما تاخدها؟
            </h3>
            <p className="geno-ui" style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 18px", lineHeight: 1.6 }}>
              سيبلنا رقمك أو إيميلك وهنكلمك خلال 24 ساعة بمكالمة مجانية لتنفيذ الأتمتة دي فعليًا.
            </p>
            <button
              onClick={() => setShowExit(false)}
              className="geno-ui"
              style={{
                width: "100%",
                background: "#00E7FF",
                border: "none",
                borderRadius: "10px",
                padding: "11px",
                color: "#070707",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              اوريني الفورم تاني
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(122,92,255,0.18) 0%, rgba(0,231,255,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "880px", margin: "0 auto", padding: "64px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            className="geno-ui"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              letterSpacing: "0.14em",
              color: "#00E7FF",
              textTransform: "uppercase",
              marginBottom: "16px",
              border: "1px solid rgba(0,231,255,0.25)",
              borderRadius: "999px",
              padding: "6px 14px",
            }}
          >
            <Sparkles size={13} /> GENO Automation Advisor
          </div>
          <h1 className="geno-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            Describe the busywork.{" "}
            <span style={{ color: "#00E7FF" }}>Watch the automation</span> build itself.
          </h1>
          <p className="geno-ui" style={{ color: "#9CA3AF", fontSize: "15px", marginTop: "14px" }}>
            اكتب مشكلة بتاخد وقتك كل يوم — أو اكتبها بالإنجليزي — وشوف الـ workflow اللي هيحلها.
          </p>
          {topCategory && (
            <p className="geno-ui" style={{ color: "#4b5563", fontSize: "12px", marginTop: "10px" }}>
              الأكثر تكرارًا بين الزوار حتى الآن: <span style={{ color: "#7A5CFF" }}>{topCategory[0]}</span> — بيانات مجهولة بدون تفاصيل شخصية
            </p>
          )}
        </div>

        {/* Category filter for examples */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "14px" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`geno-cat geno-ui ${filter === c ? "active" : ""}`}
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "999px",
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Input panel */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثلاً: بقعد أرد على كل رسايل الإنستجرام يدويًا وده بياخد ساعتين يوميًا..."
            dir={isRTL ? "rtl" : "ltr"}
            rows={3}
            className="geno-ui"
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "14px",
              color: "#FFFFFF",
              fontSize: "15px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
            {filteredExamples.slice(0, 6).map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex.text)}
                className="geno-chip geno-ui"
                dir={/[\u0600-\u06FF]/.test(ex.text) ? "rtl" : "ltr"}
                style={{
                  fontSize: "12.5px",
                  color: "#9CA3AF",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  padding: "7px 13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {ex.text.length > 46 ? ex.text.slice(0, 46) + "…" : ex.text}
              </button>
            ))}
          </div>

          <button
            onClick={() => runAdvisor(input)}
            disabled={status === "loading" || !input.trim()}
            className="geno-ui"
            style={{
              marginTop: "16px",
              width: "100%",
              background: status === "loading" ? "rgba(0,231,255,0.15)" : "#00E7FF",
              color: status === "loading" ? "#00E7FF" : "#070707",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontSize: "14.5px",
              fontWeight: 600,
              cursor: status === "loading" || !input.trim() ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: !input.trim() && status !== "loading" ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Building your workflow…
              </>
            ) : (
              <>
                Generate Automation <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {status === "error" && (
          <p style={{ color: "#f87171", textAlign: "center", marginTop: "16px", fontSize: "13.5px" }}>
            حصل خطأ أثناء توليد الخطة، جرب تاني.
          </p>
        )}

        {/* Result */}
        {plan && status === "done" && (
          <div style={{ marginTop: "40px" }}>
            <p
              className="geno-ui"
              dir={/[\u0600-\u06FF]/.test(plan.summary || "") ? "rtl" : "ltr"}
              style={{ color: "#e5e7eb", fontSize: "14.5px", margin: "0 0 20px", textAlign: "center" }}
            >
              {plan.summary}
            </p>

            {/* Time comparison bars */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "18px 20px",
                marginBottom: "20px",
              }}
            >
              <div className="geno-ui" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF", marginBottom: "6px" }}>
                <span>Manual / يدويًا</span>
                <span>{plan.manualHoursPerWeek}h / week</span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "16px" }}>
                <div
                  className="geno-bar-fill"
                  style={{ height: "100%", borderRadius: "999px", background: "#7A5CFF", width: barsIn ? `${(plan.manualHoursPerWeek / maxHours) * 100}%` : "0%" }}
                />
              </div>
              <div className="geno-ui" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF", marginBottom: "6px" }}>
                <span>After automation / بعد الأتمتة</span>
                <span>{plan.automatedHoursPerWeek}h / week</span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div
                  className="geno-bar-fill"
                  style={{ height: "100%", borderRadius: "999px", background: "#00E7FF", width: barsIn ? `${(plan.automatedHoursPerWeek / maxHours) * 100}%` : "0%" }}
                />
              </div>
            </div>

            {/* Track toggle */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {["quick", "full"].map((tk) => (
                <button
                  key={tk}
                  onClick={() => setTrack(tk)}
                  className={`geno-track geno-ui ${track === tk ? "active" : ""}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "11px",
                    color: track === tk ? "#00E7FF" : "#9CA3AF",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tk === "quick" ? <Rocket size={14} /> : <Layers size={14} />}
                  {plan.tracks[tk].label}
                </button>
              ))}
            </div>

            {/* n8n-style workflow canvas */}
            <div
              className="geno-ui"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                color: "#6b7280",
                marginBottom: "10px",
              }}
            >
              <GitBranch size={12} /> n8n workflow preview
            </div>
            <div
              style={{
                overflowX: "auto",
                background: "#0a0a0c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "22px 18px",
                backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", width: "max-content", minWidth: "100%" }}>
                {currentNodes.map((node, i) => {
                  const style = NODE_STYLES[node.type] || NODE_STYLES.action;
                  const Icon = style.icon;
                  const visible = i < revealCount;
                  return (
                    <div key={`${track}-canvas-${i}`} style={{ display: "flex", alignItems: "center" }}>
                      <div
                        className={visible ? "geno-node" : ""}
                        style={{ opacity: visible ? undefined : 0, width: "88px", textAlign: "center", flexShrink: 0 }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: "0 auto 8px",
                            borderRadius: "12px",
                            background: `${style.color}1A`,
                            border: `1.5px solid ${style.color}77`,
                            boxShadow: visible ? `0 0 14px ${style.color}33` : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={20} color={style.color} />
                        </div>
                        <p className="geno-display" style={{ fontSize: "10.5px", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                          {node.title}
                        </p>
                      </div>

                      {i < currentNodes.length - 1 && (
                        <div style={{ width: "34px", height: "50px", display: "flex", alignItems: "center", flexShrink: 0 }}>
                          <svg width="34" height="2" style={{ overflow: "visible" }}>
                            <line
                              x1="0"
                              y1="1"
                              x2="34"
                              y2="1"
                              stroke={i + 1 < revealCount ? style.color : "rgba(255,255,255,0.15)"}
                              strokeOpacity={i + 1 < revealCount ? 0.6 : 1}
                              strokeWidth="2"
                              strokeDasharray="4 4"
                              style={i + 1 < revealCount ? { animation: "flow 0.6s linear infinite" } : {}}
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Node details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
              {currentNodes.map((node, i) => {
                const style = NODE_STYLES[node.type] || NODE_STYLES.action;
                const Icon = style.icon;
                const visible = i < revealCount;
                return (
                  <div
                    key={`${track}-detail-${i}`}
                    className={visible ? "geno-node" : ""}
                    style={{
                      opacity: visible ? undefined : 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${style.color}22`,
                      borderRadius: "12px",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: `${style.color}1A`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={14} color={style.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className="geno-display" style={{ fontSize: "13.5px", fontWeight: 600 }}>
                          {node.title}
                        </span>
                        <span
                          className="geno-ui"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: style.color,
                            border: `1px solid ${style.color}44`,
                            borderRadius: "999px",
                            padding: "2px 7px",
                          }}
                        >
                          {node.tool}
                        </span>
                      </div>
                      <p
                        className="geno-ui"
                        dir={/[\u0600-\u06FF]/.test(node.description || "") ? "rtl" : "ltr"}
                        style={{ color: "#9CA3AF", fontSize: "12.5px", margin: "3px 0 0" }}
                      >
                        {node.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {revealCount >= currentNodes.length && (
              <>
                {/* Copy button */}
                <div style={{ marginTop: "24px" }}>
                  <button
                    onClick={copyPlan}
                    className="geno-ui"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "7px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#e5e7eb",
                      fontSize: "13.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {copied ? <Check size={15} color="#00E7FF" /> : <Copy size={15} />}
                    {copied ? "Copied" : "Copy plan"}
                  </button>
                </div>

                {/* Trust bar */}
                <div className="geno-ui" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
                  {["🎯 مكالمة تعريفية مجانية", "🛠 سعر مخصص حسب مشروعك", "🤝 شهر متابعة بعد التسليم"].map((t, i) => (
                    <div
                      key={i}
                      style={{
                        flex: "1 1 160px",
                        textAlign: "center",
                        fontSize: "12.5px",
                        color: "#9CA3AF",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <p className="geno-ui" dir="rtl" style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                  {PRICE_NOTE}
                </p>

                {/* Timeline */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "22px", gap: "4px" }}>
                  {TIMELINE[track].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00E7FF", margin: "0 auto 8px" }} />
                        <p className="geno-ui" style={{ fontSize: "12.5px", color: "#e5e7eb", margin: 0, fontWeight: 500 }}>{step.label}</p>
                        <p className="geno-ui" style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 0" }}>{step.detail}</p>
                      </div>
                      {i < TIMELINE[track].length - 1 && (
                        <div style={{ flex: 1, height: "1px", background: "rgba(0,231,255,0.25)", marginTop: "-28px" }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div style={{ display: "flex", gap: "10px", marginTop: "22px", overflowX: "auto", paddingBottom: "4px" }}>
                  {TESTIMONIALS.map((t, i) => (
                    <div
                      key={i}
                      className="geno-ui"
                      dir={/[\u0600-\u06FF]/.test(t.quote) ? "rtl" : "ltr"}
                      style={{
                        flex: "0 0 240px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        padding: "14px",
                      }}
                    >
                      <Quote size={14} color="#00E7FF" style={{ marginBottom: "6px" }} />
                      <p style={{ fontSize: "12.5px", color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{t.quote}</p>
                      <p style={{ fontSize: "11.5px", color: "#6b7280", margin: "8px 0 0" }}>
                        {t.name} · {t.role}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Case study */}
                <div
                  className="geno-ui"
                  dir="rtl"
                  style={{
                    marginTop: "22px",
                    fontSize: "13px",
                    color: "#9CA3AF",
                    background: "rgba(122,92,255,0.06)",
                    border: "1px solid rgba(122,92,255,0.2)",
                    borderRadius: "10px",
                    padding: "13px 15px",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "#7A5CFF", fontWeight: 600 }}>من نوع مشاريعنا: </span>
                  {CASE_STUDIES[plan.category] || CASE_STUDIES.Other}
                </div>

                {/* Lead capture */}
                <div
                  style={{
                    marginTop: "22px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  {leadSent ? (
                    <div style={{ textAlign: "center" }}>
                      <p className="geno-ui" style={{ color: "#00E7FF", fontSize: "13.5px", margin: 0 }}>
                        تمام! افتحنالك رسالة إيميل جاهزة — ابعتها ونكلمك في أسرع وقت.
                      </p>
                      <a
                        href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                          "لسه جربت أداة GENO's AI Automation Advisor وطلعتلي خطة أتمتة كاملة لمشكلة كانت بتاخد وقتي كل يوم 🚀"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="geno-ui"
                        style={{
                          marginTop: "14px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#8DF7FF",
                          fontSize: "12.5px",
                          textDecoration: "none",
                          border: "1px solid rgba(141,247,255,0.3)",
                          borderRadius: "999px",
                          padding: "7px 14px",
                        }}
                      >
                        <Linkedin size={13} /> شير التجربة على LinkedIn
                      </a>
                    </div>
                  ) : (
                    <>
                      <p className="geno-ui" dir="rtl" style={{ fontSize: "13.5px", color: "#e5e7eb", margin: "0 0 12px", fontWeight: 500 }}>
                        عايز الأتمتة دي فعليًا في بيزنسك؟ سيبلنا بياناتك ونحدد مكالمة مجانية.
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <input
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="الاسم"
                          dir="rtl"
                          className="geno-ui"
                          style={{
                            flex: "1 1 140px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            color: "#fff",
                            fontSize: "13px",
                          }}
                        />
                        <input
                          value={leadContact}
                          onChange={(e) => setLeadContact(e.target.value)}
                          placeholder="إيميل أو واتساب"
                          className="geno-ui"
                          style={{
                            flex: "1 1 160px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            color: "#fff",
                            fontSize: "13px",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                        <a
                          href={`mailto:hello@geno.dev?subject=${encodeURIComponent("طلب أتمتة — " + (leadName || "زائر الموقع"))}&body=${encodeURIComponent(
                            `الاسم: ${leadName}\nالتواصل: ${leadContact}\n\n${plan.summary}\n\n${plan.tracks[track].label}:\n` +
                              currentNodes.map((n, i) => `${i + 1}. ${n.title} (${n.tool})`).join("\n")
                          )}`}
                          onClick={() => leadName && leadContact && setLeadSent(true)}
                          className="geno-ui"
                          style={{
                            flex: "1 1 160px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            background: leadName && leadContact ? "#00E7FF" : "rgba(0,231,255,0.2)",
                            borderRadius: "10px",
                            padding: "12px",
                            color: leadName && leadContact ? "#070707" : "#6b7280",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            textDecoration: "none",
                            pointerEvents: leadName && leadContact ? "auto" : "none",
                          }}
                        >
                          <Mail size={15} /> عبر الإيميل
                        </a>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                            `اسمي ${leadName || "..."}, عايز أعمل الأتمتة دي:\n\n${plan.summary}\n\n${plan.tracks[track].label}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => leadName && setLeadSent(true)}
                          className="geno-ui"
                          style={{
                            flex: "1 1 160px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            background: "#25D366",
                            borderRadius: "10px",
                            padding: "12px",
                            color: "#070707",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          <MessageCircle size={15} /> عبر واتساب
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <p className="geno-ui" style={{ textAlign: "center", color: "#4b5563", fontSize: "12px", marginTop: "20px" }}>
              Demo workflow generated live by GENO's AI advisor — real automations are custom-built.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
