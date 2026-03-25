import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Perch, a warm and deeply knowledgeable neighborhood guide for the entire Raleigh-Durham-Chapel Hill Triangle area of North Carolina — including all the suburban markets that make up the full DMA. You help people relocating to the Triangle find the perfect neighborhood or city based on their lifestyle, budget, commute needs, and priorities.

You know this area like a local who has lived here for years. You know the difference between Fuquay-Varina's small-town charm and Cary's polished suburbs. You know why someone moving from New Jersey might love Wake Forest. You know which eastern corridor towns are underrated steals. You know where the new development is and where it feels established.

YOUR MARKET KNOWLEDGE:

RALEIGH (Urban Core & Established Neighborhoods):
- Downtown Raleigh: Young professionals, walkable, best nightlife in the Triangle, price premium, parking tough. Brewery Bhavana, Raleigh Beer Garden, Moore Square nearby.
- North Hills: Upscale midtown, self-contained, great for SAS/tech workers, luxury apartments, less gritty charm.
- Boylan Heights: Historic craftsman bungalows, front porches, tight community, steps from downtown, older housing stock.
- Five Points: Charming, local shops, great restaurants, established trees, competitive real estate market.
- Cameron Village: Central location, walkable to shops and restaurants, mix of young professionals and families.
- Brier Creek: Far northwest Raleigh, great for RTP workers, very suburban, chain restaurants, newer construction.

DURHAM (Creative & Diverse):
- Downtown Durham: The Triangle's coolest urban neighborhood. American Tobacco Campus, DPAC, James Beard restaurants, authentic creative energy. Some blocks still transitioning.
- Ninth Street / Duke Park: Best walkable neighborhood in Durham. Independent coffee, bookstores, Duke University nearby, mature trees, narrow streets.
- Woodcroft: Established family suburb in SW Durham, great schools, close to RTP, very car-dependent.
- Hope Valley: Elegant, established, golf community feel, large lots, older money Durham.
- Forest Hills: Beautiful older homes, close to downtown Durham, strong community feel.

CHAPEL HILL / CARRBORO:
- Chapel Hill / Franklin Street: UNC energy, world-class culture and hospitals, top schools, game day traffic brutal.
- Carrboro: The Triangle's most progressive artsy community. Cat's Cradle, farmers market, independent everything. Limited inventory moves fast.
- Southern Village: Planned community, very family-friendly, walkable village center, popular with UNC faculty.

CARY / APEX / MORRISVILLE (Southwest Corridor):
- Cary: Consistently one of America's safest cities. Immaculate, excellent schools, Wegmans, easy RTP access. Very suburban — no urban grit.
- Apex: Historic downtown with real charm, slightly more affordable than Cary, fast-growing, great schools. Construction and traffic growing pains.
- Morrisville: Inside RTP, extremely diverse and international, most convenient tech commute, lacks walkable downtown.
- Holly Springs: Fast-growing southern suburb, newer construction, excellent schools, BB&T ballpark, family-friendly, slightly farther commute.
- Fuquay-Varina: Real small-town charm with a genuine historic downtown, more affordable than Holly Springs, growing fast, great for families wanting space. About 30 min to downtown Raleigh.

NORTHERN SUBURBS:
- Wake Forest: Booming northern suburb, hugely popular with families relocating from the Northeast and Midwest. Excellent schools, newer construction, real downtown with character, WakeMed hospital nearby. About 25 min to downtown Raleigh. One of the fastest-growing towns in NC.

EASTERN CORRIDOR (Affordable & Up-and-Coming):
- Garner: Underrated and underpriced. South of Raleigh, close-in, great for first-time buyers priced out of Raleigh proper. More established feel than the far suburbs, easy I-40 access. 15 min to downtown Raleigh.
- Knightdale: Eastern Raleigh suburb, very family-oriented, newer subdivisions, affordable, growing fast. 20 min to downtown, longer commute trade-off rewarded with lower prices and larger lots.
- Clayton: Johnston County, further out but increasingly popular. Affordable homes, small-town feel, good schools. 30-35 min to Raleigh. Great for buyers who want the most house for their money.
- Wendell: Small and authentic, east of Raleigh, very affordable, genuine small-town vibe. Wendell Falls is a notable master-planned community here. 25 min to downtown.
- Zebulon: Most rural of the Triangle suburbs, Johnston County border, very affordable, small-town feel, honest trade-offs on commute (30-40 min) and amenities. Best for buyers who want acreage or maximum value.

CONVERSATION FLOW:
1. Greet them warmly and ask what brings them to the Triangle (job, family, lifestyle change, remote work?)
2. Naturally gather through conversation: budget (rent or buy), who's moving (solo/partner/kids/roommates), where they'll be working or spending most time, lifestyle priorities
3. Once you have enough context (usually 3-4 exchanges), recommend TOP 3 places that fit them best
4. IMPORTANT: Format neighborhood names as plain text — do NOT use asterisks or markdown formatting like **bold**. Just write the neighborhood name naturally in the sentence.
5. After giving recommendations, ask at least 1-2 follow up questions like "Want me to go deeper on any of these?" or "Do you have any questions about the commute or schools?" — have a real back and forth before offering the specialist connection
6. Only after the user has engaged with the recommendations and asked follow up questions, THEN naturally say something like "I can connect you with local specialists who know these communities inside and out — want me to set that up?" and end with [SHOW_LEAD_FORM]
7. NEVER show [SHOW_LEAD_FORM] on the first message after recommendations — always have at least one more exchange first

IMPORTANT RULES:
- Be conversational — gather info through natural dialogue, not a checklist
- Always be specific to the Triangle — never give generic advice
- Give honest opinions
- NEVER use asterisks or markdown bold/italic formatting in your responses — plain conversational text only
- Reference real landmarks, employers, roads (I-40, 540, 64, US-1), and local spots
- When someone mentions a tight budget, proactively mention eastern corridor and Fuquay-Varina/Garner
- When someone mentions kids/schools, always consider Wake Forest, Cary, Apex, Holly Springs
- When someone mentions remote work, open up the full map including Clayton, Wendell, Zebulon
- Keep responses concise and warm — you're texting a brilliant local friend, not writing a report
- Only show [SHOW_LEAD_FORM] after recommendations AND at least one follow-up exchange`;

const C = {
  cream: "#F7F2E8", creamMid: "#EEE8D8", creamDark: "#E4DCCA",
  sage: "#4E7050", sageDark: "#335235", sageMid: "#6B8F6D",
  sageLight: "#B8CEB8", sagePale: "rgba(78,112,80,0.08)",
  terra: "#B85C38", terraLight: "rgba(184,92,56,0.1)",
  sand: "#D8CCAA", sandLight: "rgba(216,204,170,0.3)",
  textDark: "#252018", textMid: "#4E4838", textLight: "#8A7E6A",
  white: "#FDFAF2",
  gold: "#C8963E",
};

const serif = "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
const sans = "'Gill Sans', 'Gill Sans MT', Optima, Candara, sans-serif";

const MARKETS = [
  "Raleigh", "Durham", "Chapel Hill", "Carrboro",
  "Cary", "Apex", "Wake Forest", "Holly Springs",
  "Fuquay-Varina", "Garner", "Knightdale", "Clayton",
  "Morrisville", "Wendell", "Zebulon"
];

// Bird SVG logo — a simple elegant perched bird
function BirdLogo({ size = 32, color = "#C8963E" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="52" cy="52" rx="22" ry="16" fill={color} transform="rotate(-15 52 52)" />
      {/* Head */}
      <circle cx="72" cy="36" r="13" fill={color} />
      {/* Beak */}
      <polygon points="83,34 95,38 83,42" fill="#8B6914" />
      {/* Eye */}
      <circle cx="76" cy="34" r="3" fill="#1a1a1a" />
      <circle cx="77" cy="33" r="1" fill="white" />
      {/* Tail */}
      <polygon points="30,55 10,45 12,60 10,72 32,62" fill={color} />
      {/* Wing detail */}
      <ellipse cx="50" cy="54" rx="14" ry="7" fill="#A67830" transform="rotate(-15 50 54)" opacity="0.5" />
      {/* Legs */}
      <line x1="50" y1="67" x2="44" y2="80" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="68" x2="50" y2="80" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="44" y1="80" x2="38" y2="85" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="80" x2="44" y2="86" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="80" x2="50" y2="85" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="80" x2="44" y2="85" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="80" x2="50" y2="86" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="80" x2="56" y2="85" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "14px 18px", background: C.white, border: `1px solid ${C.creamDark}`, borderRadius: "18px 18px 18px 4px", width: "fit-content", marginBottom: 16 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.sageLight, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  const content = msg.content.replace("[SHOW_LEAD_FORM]", "").trim();
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16, alignItems: "flex-end", gap: 8 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, background: C.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
          <BirdLogo size={22} color="white" />
        </div>
      )}
      <div style={{
        maxWidth: "75%", background: isUser ? C.sageDark : C.white,
        color: isUser ? C.white : C.textDark, padding: "13px 18px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontSize: 15, lineHeight: 1.65, fontFamily: serif,
        border: isUser ? "none" : `1px solid ${C.creamDark}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap",
      }}>
        {content}
      </div>
    </div>
  );
}

function LeadForm({ conversationSummary, onSubmit, onSkip }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", timeline: "", type: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.timeline) e.timeline = "Please select a timeline";
    if (!form.type) e.type = "Please select one";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
    onSubmit({ ...form, ...conversationSummary, submittedAt: new Date().toISOString() });
  };

  if (submitted) return (
    <div style={{ background: C.white, border: `1.5px solid ${C.sageLight}`, padding: "28px", marginBottom: 16, maxWidth: "85%" }}>
      <div style={{ marginBottom: 12 }}><BirdLogo size={36} color={C.gold} /></div>
      <div style={{ fontFamily: serif, fontSize: 18, color: C.sageDark, marginBottom: 8 }}>You're all set!</div>
      <p style={{ fontFamily: serif, fontSize: 14, color: C.textMid, lineHeight: 1.6, margin: 0 }}>
        A local specialist who knows {conversationSummary.topMatch || "the Triangle"} will be in touch within 24 hours. They'll have your full Perch profile so you won't have to repeat yourself.
      </p>
    </div>
  );

  const inputStyle = (err) => ({
    width: "100%", background: C.cream,
    border: `1.5px solid ${err ? C.terra : C.creamDark}`,
    color: C.textDark, padding: "11px 14px", fontSize: 14,
    fontFamily: serif, outline: "none", boxSizing: "border-box", borderRadius: 2,
  });

  const labelStyle = { fontFamily: sans, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textLight, marginBottom: 5, display: "block" };
  const errorStyle = { fontFamily: sans, fontSize: 11, color: C.terra, marginTop: 4 };

  return (
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, border: `1.5px solid ${C.sageLight}`, padding: "24px", marginBottom: 16, maxWidth: "90%", boxShadow: `0 4px 24px rgba(78,112,80,0.1)` }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.terra, marginBottom: 6 }}>Connect with a local specialist</div>
        <div style={{ fontFamily: serif, fontSize: 17, color: C.textDark, marginBottom: 6 }}>Let's find your perfect place in {conversationSummary.topMatch || "the Triangle"}</div>
        <div style={{ fontFamily: serif, fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>A specialist with deep knowledge of your matched neighborhoods will reach out within 24 hours — with listings tailored to exactly what you told Perch.</div>
      </div>

      {conversationSummary.highlights && conversationSummary.highlights.length > 0 && (
        <div style={{ background: C.sagePale, border: `1px solid ${C.sageLight}`, padding: "12px 14px", marginBottom: 18, borderRadius: 2 }}>
          <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.sageMid, marginBottom: 8 }}>Your Perch Profile</div>
          {conversationSummary.highlights.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.textMid, fontFamily: serif, padding: "2px 0", lineHeight: 1.4 }}>
              <span style={{ color: C.terra, flexShrink: 0 }}>✦</span> {h}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle(errors.name)} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Sarah Mitchell" />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle(false)} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="919-555-0100" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Email Address *</label>
        <input style={inputStyle(errors.email)} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        {errors.email && <div style={errorStyle}>{errors.email}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div>
          <label style={labelStyle}>Move Timeline *</label>
          <select style={{ ...inputStyle(errors.timeline), appearance: "none" }} value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}>
            <option value="">Select...</option>
            <option value="asap">ASAP / Already here</option>
            <option value="30days">Within 30 days</option>
            <option value="60days">30–60 days</option>
            <option value="90days">60–90 days</option>
            <option value="6months">3–6 months</option>
            <option value="exploring">Just exploring</option>
          </select>
          {errors.timeline && <div style={errorStyle}>{errors.timeline}</div>}
        </div>
        <div>
          <label style={labelStyle}>Renting or Buying? *</label>
          <select style={{ ...inputStyle(errors.type), appearance: "none" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select...</option>
            <option value="rent">Renting</option>
            <option value="buy">Buying</option>
            <option value="either">Open to either</option>
          </select>
          {errors.type && <div style={errorStyle}>{errors.type}</div>}
        </div>
      </div>

      <div style={{ fontFamily: sans, fontSize: 11, color: C.textLight, lineHeight: 1.5, marginBottom: 16, letterSpacing: "0.02em" }}>
        🔒 Your information is only shared with the specialist matched to your neighborhoods. No spam, no mass lists.
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={handleSubmit} style={{ background: C.terra, color: C.white, border: "none", padding: "14px 32px", fontSize: 13, fontFamily: sans, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", flex: 1 }}>
          Connect Me with a Specialist →
        </button>
        <button onClick={onSkip} style={{ background: "none", border: "none", color: C.textLight, fontFamily: sans, fontSize: 12, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 8px", whiteSpace: "nowrap" }}>
          Not now
        </button>
      </div>
    </div>
  );
}

function extractConversationSummary(messages) {
  const fullText = messages.map(m => m.content).join(" ").toLowerCase();
  const highlights = [];
  let topMatch = "";

  if (fullText.includes("rent") && !fullText.includes("buying")) highlights.push("Looking to rent");
  else if (fullText.includes("buy") || fullText.includes("purchase")) highlights.push("Looking to buy");

  if (fullText.includes("kids") || fullText.includes("children") || fullText.includes("school")) highlights.push("Moving with family / children");
  else if (fullText.includes("partner") || fullText.includes("spouse") || fullText.includes("wife") || fullText.includes("husband")) highlights.push("Moving with partner");
  else if (fullText.includes("roommate")) highlights.push("Moving with roommates");
  else if (fullText.includes("just me") || fullText.includes("solo") || fullText.includes("myself")) highlights.push("Moving solo");

  const employers = ["rtp", "cisco", "sas", "red hat", "duke", "unc", "wakemed", "rex", "ibm", "lenovo", "remote"];
  employers.forEach(e => { if (fullText.includes(e)) highlights.push(`Works at / near ${e.toUpperCase()}`); });

  const assistantText = messages.filter(m => m.role === "assistant").map(m => m.content).join(" ");
  const neighborhoods = ["apex", "cary", "wake forest", "downtown raleigh", "north hills", "downtown durham", "chapel hill", "carrboro", "morrisville", "holly springs", "fuquay-varina", "garner", "knightdale", "clayton", "wendell", "zebulon"];
  for (const n of neighborhoods) {
    if (assistantText.toLowerCase().includes(n)) {
      topMatch = n.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      break;
    }
  }

  if (topMatch) highlights.push(`Top Perch match: ${topMatch}`);
  return { highlights, topMatch };
}

export default function Perch() {
  const [screen, setScreen] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  const startChat = async () => {
    setScreen("chat");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: "Hi, I'm looking to move to the Triangle area." }]
        })
      });
      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("");
      setMessages([{ role: "assistant", content: text }]);
    } catch (e) {
      setMessages([{ role: "assistant", content: "Hey! Welcome to Perch. Having a little trouble connecting — try refreshing and we'll get started." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("");
      if (text.includes("[SHOW_LEAD_FORM]") && !showLeadForm && !leadSubmitted) {
        setShowLeadForm(true);
      }
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try sending that again!" }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleLeadSubmit = (leadData) => {
    console.log("NEW PERCH LEAD:", leadData);
    setLeadSubmitted(true);
    setShowLeadForm(false);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `You're all set! A local specialist who knows ${leadData.topMatch || "the Triangle"} will reach out within 24 hours. They'll already have your full Perch profile so you won't have to repeat yourself.\n\nIn the meantime, feel free to keep asking me anything about any of these neighborhoods.`
    }]);
  };

  const conversationSummary = extractConversationSummary(messages);

  // LANDING
  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: serif, color: C.textDark, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 50% at 15% 15%, rgba(78,112,80,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 85%, rgba(184,92,56,0.05) 0%, transparent 70%)` }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60, paddingBottom: 60 }}>

          {/* Bird logo on landing */}
          <div style={{ marginBottom: 24 }}>
            <BirdLogo size={56} color={C.gold} />
          </div>

          <h1 style={{ fontSize: "clamp(54px, 10vw, 92px)", fontWeight: 400, lineHeight: 0.98, letterSpacing: "-0.025em", margin: "0", fontFamily: serif, color: C.textDark }}>Find where</h1>
          <h1 style={{ fontSize: "clamp(54px, 10vw, 92px)", fontWeight: 400, lineHeight: 0.98, letterSpacing: "-0.025em", margin: "0 0 28px", fontFamily: serif, color: C.terra, fontStyle: "italic" }}>you land.</h1>
          <div style={{ width: 52, height: 2, background: C.sand, marginBottom: 28 }} />
          <p style={{ fontSize: 18, color: C.textMid, maxWidth: 460, lineHeight: 1.72, marginBottom: 16, fontFamily: serif }}>
            Tell Perch where you're coming from, what you do, and how you like to live — and get matched to the right Triangle neighborhood in a real conversation.
          </p>
          <p style={{ fontSize: 14, color: C.textLight, maxWidth: 400, lineHeight: 1.6, marginBottom: 40, fontFamily: sans, letterSpacing: "0.02em" }}>
            No forms. No filters. Just a chat with someone who knows the Triangle inside and out.
          </p>

          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.sageMid, marginBottom: 12 }}>Covering the full Triangle</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {MARKETS.map(city => (
                <span key={city} style={{ fontFamily: sans, fontSize: 11, color: C.sageDark, border: `1px solid ${C.sageLight}`, padding: "4px 11px", background: C.sagePale, letterSpacing: "0.03em" }}>{city}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <button onClick={startChat} style={{ background: C.terra, color: C.white, border: "none", padding: "18px 48px", fontSize: 13, fontFamily: sans, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
              Start the Conversation →
            </button>
            <span style={{ fontFamily: sans, fontSize: 12, color: C.textLight, letterSpacing: "0.04em" }}>Free · No signup needed</span>
          </div>

          <div style={{ display: "flex", gap: 36, marginTop: 56, paddingTop: 32, borderTop: `1px solid ${C.creamDark}` }}>
            {[["15", "Cities & towns"], ["164k+", "Housing units"], ["60 sec", "To your match"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 400, color: C.sageDark, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.textLight, letterSpacing: "0.08em", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // CHAT
  return (
    <div style={{ height: "100vh", background: C.cream, display: "flex", flexDirection: "column", fontFamily: serif, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 50% 40% at 10% 10%, rgba(78,112,80,0.05) 0%, transparent 60%)` }} />

      {/* Header with bird logo */}
      <div style={{ background: C.cream, borderBottom: `1px solid ${C.creamDark}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: C.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BirdLogo size={26} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 400, color: C.textDark, letterSpacing: "-0.01em" }}>Perch</div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.sageMid, letterSpacing: "0.15em", textTransform: "uppercase" }}>Triangle Neighborhood Guide</div>
          </div>
        </div>
        <button onClick={() => { setScreen("landing"); setMessages([]); setShowLeadForm(false); setLeadSubmitted(false); }} style={{ background: "none", border: `1px solid ${C.creamDark}`, color: C.textLight, fontFamily: sans, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", padding: "7px 16px" }}>← Home</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px 12px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {loading && messages.length === 0 && <TypingIndicator />}
          {messages.map((msg, i) => (
            <div key={i}>
              <Message msg={msg} />
              {showLeadForm && !leadSubmitted && msg.role === "assistant" && msg.content.includes("[SHOW_LEAD_FORM]") && i === messages.length - 1 && (
                <LeadForm conversationSummary={conversationSummary} onSubmit={handleLeadSubmit} onSkip={() => setShowLeadForm(false)} />
              )}
            </div>
          ))}
          {loading && messages.length > 0 && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${C.creamDark}`, background: C.white, padding: "16px 24px", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tell me about yourself — where you're coming from, what you do, how you like to live..."
            rows={1}
            style={{ flex: 1, background: C.cream, border: `1.5px solid ${C.creamDark}`, color: C.textDark, padding: "13px 16px", fontSize: 15, fontFamily: serif, resize: "none", outline: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto", borderRadius: 2 }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? C.terra : C.sand, color: input.trim() && !loading ? C.white : C.textLight, border: "none", padding: "13px 22px", fontSize: 20, cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.2s", flexShrink: 0, borderRadius: 2 }}>↑</button>
        </div>
        <div style={{ maxWidth: 640, margin: "8px auto 0", fontFamily: sans, fontSize: 11, color: C.textLight, letterSpacing: "0.04em" }}>
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
