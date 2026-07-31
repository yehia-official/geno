// GENO Automation Advisor — backend proxy
// يستقبل مشكلة المستخدم، يكلم Anthropic API بالـ key السري، ويرجع النتيجة للفرونت إند.
// الـ API key بيفضل على السيرفر بس وميوصلش لمتصفح الزائر خالص.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json({ limit: "10kb" }));

// CORS: اسمح بس لدومين موقعك (غيّر القيمة دي لدومين GENO الحقيقي)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://geno.dev";
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["POST"],
  })
);

// Rate limiting: يمنع استغلال الـ endpoint وضياع فلوسك على استدعاءات كتير
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 20, // 20 طلب لكل IP كل 15 دقيقة
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "طلبات كتير جدًا، جرب بعد شوية." },
});

const SYSTEM_PROMPT = `You are the automation advisor embedded in GENO's website, an AI automation studio. A visitor describes a repetitive business problem, in Arabic or English. Design two realistic n8n-style automation workflows that solve it: a cheap/simple "quick" version and a more complete "full" version.

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

app.post("/api/advisor", limiter, async (req, res) => {
  const problem = (req.body?.problem || "").toString().trim();

  if (!problem) {
    return res.status(400).json({ error: "problem is required" });
  }
  if (problem.length > 800) {
    return res.status(400).json({ error: "problem is too long" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: problem }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({ error: "upstream error" });
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((b) => b.text || "")
      .join("")
      .trim();
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("Failed to parse model output:", text);
      return res.status(502).json({ error: "bad model output" });
    }

    if (!parsed.tracks?.quick?.nodes?.length || !parsed.tracks?.full?.nodes?.length) {
      return res.status(502).json({ error: "bad shape" });
    }

    res.json(parsed);
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "internal error" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`GENO advisor proxy running on port ${PORT}`));
