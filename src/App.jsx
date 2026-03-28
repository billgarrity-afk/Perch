import { useState, useRef, useEffect } from "react";

// Ruby illustrated mascot — full body waving (landing page hero)
const RUBY_HERO = "https://res.cloudinary.com/dhtxz02lj/image/upload/v1774613663/9056233F-EDAF-4517-8D98-3295A4B9B130_eu39i4.png";

// Ruby circular badge (nav + chat avatar)
const RUBY_BADGE = "https://res.cloudinary.com/dhtxz02lj/image/upload/v1774616683/EEDFA510-9F58-4F7A-B819-DAF836E8E08E_s7mmnp.png";

const SYSTEM_PROMPT = `You are Ruby, the friendly and knowledgeable neighborhood guide for the Raleigh-Durham-Chapel Hill Triangle area of North Carolina — including all the suburban markets that make up the full DMA. You are the warm, intelligent face of Perch, powered by ClubOS AI. You help people relocating to the Triangle find the perfect neighborhood or city based on their lifestyle, budget, commute needs, and priorities.

You have the warmth and trustworthiness of a golden retriever — approachable, genuine, and deeply knowledgeable about the Triangle. You never judge. You never rush. You listen carefully and give honest, specific guidance like a trusted local friend.

YOUR MARKET KNOWLEDGE:

RALEIGH:
- Downtown Raleigh: Young professionals, walkable, best nightlife, price premium, parking tough. Brewery Bhavana, Raleigh Beer Garden, Moore Square.
- North Hills: Upscale midtown, self-contained, great for SAS/tech workers, luxury apartments, less gritty charm.
- Boylan Heights: Historic craftsman bungalows, front porches, tight community, steps from downtown, older housing stock.
- Five Points: Charming, local shops, great restaurants, established trees, competitive market.
- Cameron Village: Central, walkable to shops and restaurants, young professionals and families.
- Brier Creek: Far northwest Raleigh, great for RTP workers, very suburban, newer construction.

DURHAM:
- Downtown Durham: Triangle's coolest urban neighborhood. American Tobacco Campus, DPAC, James Beard restaurants, authentic creative energy.
- Ninth Street / Duke Park: Best walkable Durham neighborhood. Independent coffee, bookstores, Duke nearby, mature trees.
- Woodcroft: Established family suburb, SW Durham, great schools, close to RTP, car-dependent.
- Hope Valley: Elegant, established, golf community feel, large lots.
- Forest Hills: Beautiful older homes, close to downtown Durham.

CHAPEL HILL / CARRBORO:
- Chapel Hill / Franklin Street: UNC energy, world-class culture and hospitals, top schools, game day traffic brutal.
- Carrboro: Most progressive artsy community. Cat's Cradle, farmers market, independent everything.
- Southern Village: Planned community, family-friendly, walkable village center.

CARY / APEX / MORRISVILLE:
- Cary: One of America's safest cities. Immaculate, excellent schools (top-ranked in Wake County), Wegmans, easy RTP access. Lochmere Golf Club is here — one of the best junior golf programs in the Triangle.
- Apex: Historic downtown with charm, slightly more affordable than Cary, fast-growing, great schools.
- Morrisville: Inside RTP, extremely diverse, most convenient tech commute, lacks walkable downtown.
- Holly Springs: Fast-growing southern suburb, newer construction, excellent schools, family-friendly. Devil's Ridge Golf Club nearby.
- Fuquay-Varina: Real small-town charm, more affordable than Holly Springs, growing fast. 30 min to Raleigh.

NORTHERN SUBURBS:
- Wake Forest: Booming northern suburb, popular with families from Northeast/Midwest. Excellent schools, newer construction, real downtown. 25 min to Raleigh.

EASTERN CORRIDOR:
- Garner: Underrated and underpriced. South of Raleigh, great for first-time buyers. 15 min to downtown.
- Knightdale: Family-oriented, newer subdivisions, affordable, growing fast. 20 min to downtown.
- Clayton: Further out, affordable homes, small-town feel, good schools. 30-35 min to Raleigh.
- Wendell: Small and authentic, very affordable. Wendell Falls is notable here. 25 min to downtown.
- Zebulon: Most rural, very affordable, small-town feel, best for buyers wanting acreage. 30-40 min commute.

GOLF COURSES IN THE TRIANGLE:
- Lonnie Poole Golf Course: NC State's course, open to public, Raleigh near Centennial Campus. Excellent junior programs, challenging layout, great value. One of the best public courses in the Triangle.
- Lochmere Golf Club: Cary. Excellent junior development, family-friendly, one of the best teaching programs in the area. Top pick for families with junior golfers.
- Prestonwood Country Club: Cary, private, two championship courses, high-end membership, strong golf culture.
- Treyburn Country Club: Durham, private, Tom Fazio design, exclusive, beautiful setting.
- Devil's Ridge Golf Club: Holly Springs, semi-private, excellent course, strong value.
- Hedingham Golf Club: East Raleigh, public, affordable, popular with locals and beginners.
- Brier Creek Country Club: Northwest Raleigh, private, good for tech/SAS corridor families.
- Tobacco Road Golf Club: Sanford (45 min south), Mike Strantz design, bucket-list course worth the drive for serious golfers.
- Pinehurst Resort: 45-60 min south, world-class, No. 2 is a national treasure. Regular day trips for serious golfers.
For families with junior golfers: Lochmere (Cary) and Lonnie Poole (Raleigh) are the two best starting points in the Triangle. Cary and the surrounding area has excellent junior golf infrastructure overall.

CONVERSATION FLOW:
1. Greet them warmly as Ruby and ask what brings them to the Triangle
2. Naturally gather: budget (rent or buy), who's moving, where they'll work, lifestyle priorities
3. After 3-4 exchanges, deliver ALL THREE neighborhood recommendations at once using the EXACT JSON block format below — no partial reveals, no "want to see more?"
4. After the JSON block, add a short warm follow-up message asking what resonates or if they have questions
5. Write neighborhood names as plain text — never use asterisks or markdown bold like **Wake Forest**
6. After recommendations, ask follow-up questions, dig into their priorities before offering specialist connection
7. Only after genuine engagement (at least 2 exchanges after recommendations) offer to connect them with local specialists and end with [SHOW_LEAD_FORM]
8. NEVER show [SHOW_LEAD_FORM] on the first message after recommendations
9. CRITICAL: Your neighborhood recommendations must be driven entirely by what the user told you — budget, commute, schools, family situation, lifestyle priorities. Do not default to Raleigh neighborhoods unless the user's stated priorities point specifically there. If they mention schools, golf, or safety, Cary and Apex should rank high. If they mention urban life, walkability, or nightlife, lean Raleigh or Durham.
10. IMPORTANT: When a user gives a short answer to your question (like "6 months" or "yes" or a number), recognize it as a direct answer to what you just asked and respond accordingly. Do not treat short answers as incomplete or ambiguous — they are answering your question.

NEIGHBORHOOD CARD FORMAT — USE THIS EXACTLY when delivering recommendations:
When you are ready to share neighborhoods, output a JSON block wrapped in triple backticks with the language tag "neighborhoods" like this:

\`\`\`neighborhoods
[
  {
    "rank": 1,
    "name": "Cary",
    "tagline": "Safe, polished, and built for families",
    "rentRange": "$1,800–$2,800/mo",
    "buyRange": "$420K–$650K",
    "commute": "15 min to RTP via I-40",
    "loves": ["Top-ranked Wake County schools", "Lochmere Golf Club for junior golfers", "Wegmans and everything you need"],
    "tradeoff": "It's pristine but not edgy — you won't find much grit or nightlife here",
    "redditPulse": "Best public schools in Wake County — families from DC and NJ are consistently surprised",
    "tiktokSignal": "Not exciting, but excellent — creators who moved here keep saying it",
    "nextdoorTemp": "Greenway trails and safety are what residents talk about most"
  },
  {
    "rank": 2,
    "name": "Apex",
    "tagline": "Cary's charming neighbor with a real downtown",
    "rentRange": "$1,600–$2,400/mo",
    "buyRange": "$380K–$550K",
    "commute": "20 min to RTP via US-64",
    "loves": ["Historic downtown with local restaurants", "Slightly more affordable than Cary", "Excellent schools"],
    "tradeoff": "Growing fast — traffic on US-64 is getting real",
    "redditPulse": "What Cary was 10 years ago — locals say this with pride, not concern",
    "tiktokSignal": "Salem Street surprises every newcomer — nobody expects a real downtown",
    "nextdoorTemp": "Strong community turnout for events; growth anxiety is the honest tension"
  },
  {
    "rank": 3,
    "name": "Wake Forest",
    "tagline": "Northeast gem popular with relocating families",
    "rentRange": "$1,500–$2,200/mo",
    "buyRange": "$340K–$500K",
    "commute": "25 min to Raleigh via US-1",
    "loves": ["Newer construction with space", "Strong schools and family community", "Real small-town downtown"],
    "tradeoff": "Furthest from RTP — the commute adds up if you're heading west",
    "redditPulse": "Go-to for Northeast and Midwest families who want community feel at a real price point",
    "tiktokSignal": "Remote workers call it the Triangle's best-kept secret — most space for the money",
    "nextdoorTemp": "Neighbors introduce themselves within days — high civic participation is structural here"
  }
]
\`\`\`

IMPORTANT: Always populate redditPulse, tiktokSignal, and nextdoorTemp for every neighborhood you recommend using one specific, honest observation from what you know about each place. Keep each under 12 words. These are real signals locals share — write them that way.

After the JSON block, always follow with a brief warm message like: "Those are my top three for you — what's jumping out? Any of those feel like home?"

RUBY'S RULES:
- Warm, direct, genuinely helpful — like a trusted friend who grew up here
- Never use asterisks or markdown — plain conversational text only (except inside the neighborhoods JSON block)
- Always be specific to the Triangle — never generic
- Give honest opinions including honest tradeoffs
- Reference real landmarks, employers, roads (I-40, 540, 64, US-1)
- Tight budget → mention Garner, Knightdale, Fuquay-Varina
- Kids/schools → Wake Forest, Cary, Apex, Holly Springs
- Golf families → Cary (Lochmere), Raleigh (Lonnie Poole), Holly Springs (Devil's Ridge)
- Remote work → Clayton, Wendell, Zebulon`;

const C = {
  white: "#FFFFFF",
  offWhite: "#F8F9FB",
  navy: "#0A1628",
  navyMid: "#152238",
  navyLight: "#1E3250",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldPale: "rgba(201,168,76,0.12)",
  steel: "#E8EDF4",
  steelDark: "#D0D9E8",
  textDark: "#0A1628",
  textMid: "#4A5568",
  textLight: "#8A9BB0",
  ruby: "#C0392B",
};

const display = "'Playfair Display', 'Didot', Georgia, serif";
const body = "'DM Sans', 'Helvetica Neue', system-ui, sans-serif";

const MARKETS = [
  "Raleigh", "Durham", "Chapel Hill", "Carrboro", "Cary",
  "Apex", "Wake Forest", "Holly Springs", "Fuquay-Varina",
  "Garner", "Knightdale", "Clayton", "Morrisville", "Wendell", "Zebulon"
];

// ── Parse neighborhood cards out of Ruby's response ──
function parseNeighborhoodCards(text) {
  const match = text.match(/```neighborhoods\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch (e) {
    console.error("Failed to parse neighborhood cards:", e);
    return null;
  }
}

// ── Strip the JSON block from the text so it doesn't appear in the chat bubble ──
function stripNeighborhoodBlock(text) {
  return text.replace(/```neighborhoods[\s\S]*?```/g, "").trim();
}

function RubyBadge({ size = 40 }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0,
      border: `2px solid ${C.gold}`,
      background: C.navyLight,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 0 3px rgba(201,168,76,0.2)`,
    }}>
      {!err
        ? <img src={RUBY_BADGE} alt="Ruby" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setErr(true)} />
        : <span style={{ fontSize: size * 0.5 }}>🐕</span>
      }
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 18px", background: C.white, border: `1px solid ${C.steel}`, borderRadius: "18px 18px 18px 4px", width: "fit-content", marginBottom: 16, boxShadow: "0 2px 8px rgba(10,22,40,0.06)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.steelDark, animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

// ── Neighborhood Card component ──
function NeighborhoodCard({ card, isTop }) {
  return (
    <div style={{
      background: C.white,
      border: `1.5px solid ${isTop ? C.gold : C.steel}`,
      borderRadius: 16,
      padding: "20px 22px",
      boxShadow: isTop
        ? "0 8px 32px rgba(201,168,76,0.15), 0 2px 8px rgba(10,22,40,0.06)"
        : "0 2px 12px rgba(10,22,40,0.06)",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isTop ? "0 12px 40px rgba(201,168,76,0.2), 0 4px 12px rgba(10,22,40,0.08)" : "0 8px 24px rgba(10,22,40,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isTop ? "0 8px 32px rgba(201,168,76,0.15), 0 2px 8px rgba(10,22,40,0.06)" : "0 2px 12px rgba(10,22,40,0.06)"; }}
    >
      {/* Top pick ribbon */}
      {isTop && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: C.gold, color: C.navy,
          fontFamily: body, fontSize: 9, fontWeight: 800,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "4px 14px",
          borderBottomLeftRadius: 10,
        }}>
          Top Pick
        </div>
      )}

      {/* Rank + Name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: isTop ? C.gold : C.steel,
          color: isTop ? C.navy : C.textMid,
          fontFamily: display, fontSize: 14, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {card.rank}
        </div>
        <div>
          <div style={{ fontFamily: display, fontSize: 20, fontWeight: 600, color: C.navy, lineHeight: 1.1 }}>{card.name}</div>
          <div style={{ fontFamily: body, fontSize: 12, color: C.textLight, marginTop: 2 }}>{card.tagline}</div>
        </div>
      </div>

      {/* Price ranges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: C.offWhite, borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ fontFamily: body, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textLight, marginBottom: 3 }}>Rent</div>
          <div style={{ fontFamily: body, fontSize: 13, fontWeight: 600, color: C.navy }}>{card.rentRange}</div>
        </div>
        <div style={{ background: C.offWhite, borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ fontFamily: body, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textLight, marginBottom: 3 }}>Buy</div>
          <div style={{ fontFamily: body, fontSize: 13, fontWeight: 600, color: C.navy }}>{card.buyRange}</div>
        </div>
      </div>

      {/* Commute */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 13 }}>🚗</span>
        <span style={{ fontFamily: body, fontSize: 12, color: C.textMid }}>{card.commute}</span>
      </div>

      {/* Love list */}
      <div style={{ marginBottom: 12 }}>
        {card.loves.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
            <span style={{ color: C.gold, fontSize: 12, marginTop: 1, flexShrink: 0 }}>✦</span>
            <span style={{ fontFamily: body, fontSize: 13, color: C.textDark, lineHeight: 1.4 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Tradeoff */}
      <div style={{
        background: "rgba(10,22,40,0.03)",
        border: `1px solid ${C.steel}`,
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex", gap: 8, alignItems: "flex-start",
        marginBottom: (card.redditPulse || card.tiktokSignal || card.nextdoorTemp) ? 12 : 0,
      }}>
        <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <span style={{ fontFamily: body, fontSize: 12, color: C.textMid, lineHeight: 1.45, fontStyle: "italic" }}>{card.tradeoff}</span>
      </div>

      {/* Sentiment strip — subtle trust signals */}
      {(card.redditPulse || card.tiktokSignal || card.nextdoorTemp) && (
        <div style={{
          borderTop: `1px solid ${C.steel}`,
          paddingTop: 10,
        }}>
          <div style={{
            fontFamily: body, fontSize: 9, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.textLight, marginBottom: 7,
          }}>
            Heard from locals
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {card.redditPulse && (
              <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: body, fontSize: 9, fontWeight: 700,
                  color: "#FF4500", background: "rgba(255,69,0,0.08)",
                  border: "1px solid rgba(255,69,0,0.2)",
                  borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                  letterSpacing: "0.04em",
                }}>Reddit</span>
                <span style={{ fontFamily: body, fontSize: 11, color: C.textMid, lineHeight: 1.4, fontStyle: "italic" }}>"{card.redditPulse}"</span>
              </div>
            )}
            {card.tiktokSignal && (
              <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: body, fontSize: 9, fontWeight: 700,
                  color: "#010101", background: "rgba(1,1,1,0.06)",
                  border: "1px solid rgba(1,1,1,0.15)",
                  borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                  letterSpacing: "0.04em",
                }}>TikTok</span>
                <span style={{ fontFamily: body, fontSize: 11, color: C.textMid, lineHeight: 1.4, fontStyle: "italic" }}>"{card.tiktokSignal}"</span>
              </div>
            )}
            {card.nextdoorTemp && (
              <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: body, fontSize: 9, fontWeight: 700,
                  color: "#00B246", background: "rgba(0,178,70,0.08)",
                  border: "1px solid rgba(0,178,70,0.2)",
                  borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                  letterSpacing: "0.04em",
                }}>Nextdoor</span>
                <span style={{ fontFamily: body, fontSize: 11, color: C.textMid, lineHeight: 1.4, fontStyle: "italic" }}>"{card.nextdoorTemp}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Three cards rendered side by side (or stacked on mobile) ──
function NeighborhoodCardRow({ cards }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 14,
        width: "100%",
      }}
        className="cards-grid"
      >
        <style>{`
          @media (max-width: 860px) {
            .cards-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {cards.map(card => (
          <NeighborhoodCard key={card.rank} card={card} isTop={card.rank === 1} />
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const cards = !isUser ? parseNeighborhoodCards(msg.content) : null;
  const displayText = cards ? stripNeighborhoodBlock(msg.content) : msg.content.replace("[SHOW_LEAD_FORM]", "").trim();

  return (
    <div style={{ marginBottom: 16 }}>
      {/* If there are cards, render them full-width first */}
      {cards && <NeighborhoodCardRow cards={cards} />}

      {/* Then render the text bubble (follow-up message after cards, or normal message) */}
      {displayText && (
        <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10 }}>
          {!isUser && <RubyBadge size={34} />}
          <div style={{
            maxWidth: "72%",
            background: isUser ? C.navy : C.white,
            color: isUser ? C.white : C.textDark,
            padding: "12px 18px",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            fontSize: 15, lineHeight: 1.65, fontFamily: body,
            border: isUser ? "none" : `1px solid ${C.steel}`,
            boxShadow: isUser ? "0 2px 12px rgba(10,22,40,0.2)" : "0 2px 8px rgba(10,22,40,0.06)",
            whiteSpace: "pre-wrap",
            letterSpacing: "-0.01em",
          }}>
            {displayText}
          </div>
        </div>
      )}
    </div>
  );
}

function LeadForm({ summary, onSubmit, onSkip }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", timeline: "", type: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.timeline) e.timeline = "Required";
    if (!form.type) e.type = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
    onSubmit({ ...form, ...summary, submittedAt: new Date().toISOString() });
  };

  if (submitted) return (
    <div style={{ background: C.white, border: `1px solid ${C.steel}`, borderRadius: 12, padding: 24, marginBottom: 16, maxWidth: "85%", boxShadow: "0 4px 20px rgba(10,22,40,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <RubyBadge size={40} />
        <div style={{ fontFamily: display, fontSize: 18, color: C.navy }}>You're all set!</div>
      </div>
      <p style={{ fontFamily: body, fontSize: 14, color: C.textMid, lineHeight: 1.6, margin: 0 }}>
        A local specialist who knows {summary.topMatch || "the Triangle"} will reach out within 24 hours — with your full Perch profile already in hand.
      </p>
    </div>
  );

  const inp = (err) => ({
    width: "100%", background: C.offWhite, border: `1.5px solid ${err ? C.ruby : C.steel}`,
    color: C.textDark, padding: "11px 14px", fontSize: 14, fontFamily: body,
    outline: "none", boxSizing: "border-box", borderRadius: 8, transition: "border-color 0.2s",
  });
  const lbl = { fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.textLight, marginBottom: 5, display: "block" };
  const errStyle = { fontFamily: body, fontSize: 11, color: C.ruby, marginTop: 4 };

  return (
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, border: `1px solid ${C.steel}`, borderRadius: 12, padding: 24, marginBottom: 16, maxWidth: "92%", boxShadow: "0 8px 32px rgba(10,22,40,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <RubyBadge size={44} />
        <div>
          <div style={{ fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: 3 }}>Connect with a local specialist</div>
          <div style={{ fontFamily: display, fontSize: 16, color: C.navy }}>Find your place in {summary.topMatch || "the Triangle"}</div>
        </div>
      </div>
      <p style={{ fontFamily: body, fontSize: 13, color: C.textMid, lineHeight: 1.55, marginBottom: 16 }}>
        Ruby will pass your full profile to a specialist — they'll reach out within 24 hours with listings matched to exactly what you told her.
      </p>

      {summary.highlights?.length > 0 && (
        <div style={{ background: C.goldPale, border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontFamily: body, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Your Perch Profile</div>
          {summary.highlights.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.textMid, fontFamily: body, padding: "2px 0" }}>
              <span style={{ color: C.gold }}>✦</span> {h}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Full Name *</label>
          <input style={inp(errors.name)} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Sarah Mitchell" />
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </div>
        <div>
          <label style={lbl}>Phone</label>
          <input style={inp(false)} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="919-555-0100" />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Email Address *</label>
        <input style={inp(errors.email)} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        {errors.email && <div style={errStyle}>{errors.email}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div>
          <label style={lbl}>Move Timeline *</label>
          <select style={{ ...inp(errors.timeline), appearance: "none" }} value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}>
            <option value="">Select...</option>
            <option value="asap">ASAP / Already here</option>
            <option value="30days">Within 30 days</option>
            <option value="60days">30–60 days</option>
            <option value="90days">60–90 days</option>
            <option value="6months">3–6 months</option>
            <option value="exploring">Just exploring</option>
          </select>
          {errors.timeline && <div style={errStyle}>{errors.timeline}</div>}
        </div>
        <div>
          <label style={lbl}>Renting or Buying? *</label>
          <select style={{ ...inp(errors.type), appearance: "none" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select...</option>
            <option value="rent">Renting</option>
            <option value="buy">Buying</option>
            <option value="either">Open to either</option>
          </select>
          {errors.type && <div style={errStyle}>{errors.type}</div>}
        </div>
      </div>
      <div style={{ fontFamily: body, fontSize: 11, color: C.textLight, marginBottom: 14 }}>
        🔒 Only shared with your matched specialist. No spam, ever.
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={handleSubmit} style={{ background: C.navy, color: C.white, border: "none", padding: "13px 28px", fontSize: 13, fontFamily: body, fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer", flex: 1, borderRadius: 8 }}>
          Connect Me with a Specialist →
        </button>
        <button onClick={onSkip} style={{ background: "none", border: "none", color: C.textLight, fontFamily: body, fontSize: 12, cursor: "pointer", padding: "13px 8px", whiteSpace: "nowrap" }}>
          Not now
        </button>
      </div>
    </div>
  );
}

function detectNeighborhoodIntent(userMessage, cards) {
  if (!cards || cards.length === 0) return null;
  const lower = userMessage.toLowerCase();
  for (const card of cards) {
    if (lower.includes(card.name.toLowerCase())) {
      return card.name;
    }
  }
  return null;
}
  const full = messages.map(m => m.content).join(" ").toLowerCase();
  const highlights = [];
  let topMatch = "";

  if (full.includes("rent") && !full.includes("buying")) highlights.push("Looking to rent");
  else if (full.includes("buy") || full.includes("purchase")) highlights.push("Looking to buy");

  if (full.includes("kids") || full.includes("children") || full.includes("school")) highlights.push("Moving with family");
  else if (full.includes("partner") || full.includes("spouse") || full.includes("wife") || full.includes("husband")) highlights.push("Moving with partner");
  else if (full.includes("roommate")) highlights.push("Moving with roommates");
  else if (full.includes("just me") || full.includes("solo")) highlights.push("Moving solo");

  ["rtp", "cisco", "sas", "red hat", "duke", "unc", "wakemed", "remote"].forEach(e => {
    if (full.includes(e)) highlights.push(`Works near ${e.toUpperCase()}`);
  });

  // Pull top match from card data if present, else fall back to text scan
  // Check user messages AFTER cards appeared — their intent overrides rank 1
  const assistantMessages = messages.filter(m => m.role === "assistant");
  let shownCards = null;
  for (let i = 0; i < assistantMessages.length; i++) {
    const cards = parseNeighborhoodCards(assistantMessages[i].content);
    if (cards && cards.length > 0) { shownCards = cards; break; }
  }
  if (shownCards) {
    // Default to rank 1
    topMatch = (shownCards.find(c => c.rank === 1) || shownCards[0]).name;
    // Scan user messages after cards for explicit neighborhood mentions
    const cardIndex = messages.findIndex(m => m.role === "assistant" && parseNeighborhoodCards(m.content));
    const userMessagesAfterCards = messages.slice(cardIndex + 1).filter(m => m.role === "user");
    for (const userMsg of userMessagesAfterCards) {
      const mentioned = detectNeighborhoodIntent(userMsg.content, shownCards);
      if (mentioned) { topMatch = mentioned; } // keep updating — last mention wins
    }
  }

  // Fallback: text scan
  if (!topMatch) {
    const hoods = [
      "apex", "cary", "wake forest", "holly springs", "fuquay-varina",
      "cameron village", "boylan heights", "five points", "north hills",
      "downtown raleigh", "downtown durham", "ninth street", "duke park",
      "chapel hill", "carrboro", "southern village",
      "morrisville", "garner", "knightdale", "clayton", "wendell", "zebulon",
      "woodcroft", "hope valley", "forest hills", "brier creek"
    ];
    for (let i = assistantMessages.length - 1; i >= 0; i--) {
      const text = assistantMessages[i].content.toLowerCase();
      for (const n of hoods) {
        if (text.includes(n)) {
          topMatch = n.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
          break;
        }
      }
      if (topMatch) break;
    }
  }

  if (topMatch) highlights.push(`Top match: ${topMatch}`);
  return { highlights, topMatch };
}

export default function Perch() {
  const [screen, setScreen] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, showForm]);

  const startChat = async () => {
    setScreen("chat");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: "Hi, I'm looking to move to the Triangle area." }]
        })
      });
      const data = await res.json();

      if (!data.content || data.error) {
        console.error("API error on startChat:", data);
        setMessages([{ role: "assistant", content: "Hey! I'm Ruby, your Triangle neighborhood guide. Having a little trouble connecting — try refreshing!" }]);
      } else {
        const text = data.content.map(i => i.text || "").join("");
        setMessages([{ role: "assistant", content: text || "Hey! I'm Ruby, your Triangle neighborhood guide. Tell me what brings you to the area!" }]);
      }
    } catch (err) {
      console.error("startChat error:", err);
      setMessages([{ role: "assistant", content: "Hey! I'm Ruby, your Triangle neighborhood guide. Having a little trouble connecting — try refreshing!" }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      if (!data.content || data.error) {
        console.error("API error on send:", data);
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had a little hiccup there. Can you say that again?" }]);
        setLoading(false);
        return;
      }

      const text = data.content.map(i => i.text || "").join("");

      if (!text.trim()) {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I didn't catch that. Can you try again?" }]);
        setLoading(false);
        return;
      }

      if (text.includes("[SHOW_LEAD_FORM]") && !showForm && !formDone) setShowForm(true);
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      console.error("Send error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try again!" }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const handleLeadSubmit = (data) => {
    setFormDone(true); setShowForm(false);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `You're all set! I've passed everything to a specialist who knows ${data.topMatch || "the Triangle"} really well. They'll be in touch within 24 hours.\n\nStill here if you have more questions!`
    }]);
  };

  const summary = extractSummary(messages);

  // ── LANDING ──
  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: C.white, fontFamily: body, color: C.textDark, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cta-primary:hover { background: #1E3250 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(10,22,40,0.25) !important; }
        .cta-gold:hover { background: #B8943C !important; transform: translateY(-1px); }
        .market-tag:hover { border-color: ${C.gold} !important; color: ${C.navy} !important; background: ${C.goldPale} !important; }
        .step-card:hover { box-shadow: 0 8px 32px rgba(10,22,40,0.1) !important; transform: translateY(-2px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .f1 { animation: fadeUp 0.6s ease forwards; }
        .f2 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; }
        .f3 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; }
        .f4 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; }
        .f5 { animation: fadeUp 0.6s ease 0.45s forwards; opacity: 0; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .ruby-card { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 0 20px !important; }
          .hero-inner { padding: 60px 20px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.steel}` }}>
        <div className="nav-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RubyBadge size={32} />
            <span style={{ fontFamily: display, fontSize: 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em" }}>Perch</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontFamily: body, fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold }}>ClubOS AI</span>
            <button className="cta-primary" onClick={startChat} style={{ background: C.navy, color: C.white, border: "none", padding: "9px 22px", fontSize: 13, fontFamily: body, fontWeight: 600, cursor: "pointer", borderRadius: 8, transition: "all 0.2s", letterSpacing: "0.02em" }}>
              Talk to Ruby
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 64 }}>
        <div className="hero-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 80, alignItems: "center" }}>

            {/* Left */}
            <div>
              <div className="f1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.goldPale, border: `1px solid rgba(201,168,76,0.35)`, borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
                <span style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold }}>Powered by ClubOS AI</span>
              </div>

              <h1 className="f2" style={{ fontFamily: display, fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.navy, marginBottom: 4 }}>
                Find where
              </h1>
              <h1 className="f2" style={{ fontFamily: display, fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.navy, marginBottom: 28, fontStyle: "italic" }}>
                you land.
              </h1>

              <p className="f3" style={{ fontSize: 18, color: C.textMid, lineHeight: 1.7, maxWidth: 480, marginBottom: 12, fontWeight: 300 }}>
                Meet Ruby — your personal Triangle neighborhood guide. Tell her where you're coming from, what you do, and how you like to live.
              </p>
              <p className="f3" style={{ fontSize: 15, color: C.textLight, marginBottom: 44 }}>
                No forms. No filters. A real conversation.
              </p>

              <div className="f4" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
                <button className="cta-primary" onClick={startChat} style={{ background: C.navy, color: C.white, border: "none", padding: "16px 40px", fontSize: 15, fontFamily: body, fontWeight: 600, cursor: "pointer", borderRadius: 10, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 16px rgba(10,22,40,0.2)" }}>
                  Talk to Ruby <span style={{ fontSize: 18 }}>→</span>
                </button>
                <span style={{ fontFamily: body, fontSize: 13, color: C.textLight }}>Free · No signup needed</span>
              </div>

              {/* Stats */}
              <div className="f5" style={{ display: "flex", gap: 40, paddingTop: 36, borderTop: `1px solid ${C.steel}` }}>
                {[["15", "Cities covered"], ["164k+", "Housing units"], ["< 60 sec", "To your match"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: display, fontSize: 28, fontWeight: 600, color: C.navy, letterSpacing: "-0.03em" }}>{n}</div>
                    <div style={{ fontFamily: body, fontSize: 12, color: C.textLight, marginTop: 3, fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Ruby hero card */}
            <div className="ruby-card f3" style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -16, background: `linear-gradient(135deg, ${C.goldPale} 0%, rgba(10,22,40,0.03) 100%)`, borderRadius: 28, zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1, background: C.white, borderRadius: 24, padding: 28, boxShadow: "0 24px 64px rgba(10,22,40,0.12), 0 4px 16px rgba(10,22,40,0.06)" }}>

                <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: 20, background: C.offWhite, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
                  <img
                    src={RUBY_HERO}
                    alt="Ruby — Perch Neighborhood Guide"
                    style={{ width: "100%", height: "auto", display: "block" }}
                    onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = '<div style="padding:60px;font-size:80px;text-align:center">🐕</div>'; }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: display, fontSize: 20, fontWeight: 600, color: C.navy }}>Ruby</div>
                    <div style={{ fontFamily: body, fontSize: 12, color: C.textLight, fontWeight: 500 }}>Triangle Neighborhood Guide</div>
                  </div>
                  <div style={{ background: C.goldPale, border: `1px solid rgba(201,168,76,0.35)`, borderRadius: 100, padding: "4px 12px" }}>
                    <span style={{ fontFamily: body, fontSize: 10, fontWeight: 700, color: C.gold }}>● Online</span>
                  </div>
                </div>

                <div style={{ background: C.offWhite, borderRadius: 12, padding: "12px 16px", border: `1px solid ${C.steel}` }}>
                  <p style={{ fontFamily: body, fontSize: 13, color: C.textMid, lineHeight: 1.55, margin: 0 }}>
                    "Hey! I'm Ruby. Tell me about yourself — where are you moving from and what brings you to the Triangle?"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Markets strip */}
      <div style={{ background: C.offWhite, borderTop: `1px solid ${C.steel}`, borderBottom: `1px solid ${C.steel}`, padding: "20px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.textLight, flexShrink: 0 }}>Covering</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MARKETS.map(city => (
              <span className="market-tag" key={city} style={{ fontFamily: body, fontSize: 12, fontWeight: 500, color: C.textMid, border: `1px solid ${C.steel}`, borderRadius: 100, padding: "4px 14px", background: C.white, cursor: "default", transition: "all 0.15s" }}>{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontFamily: body, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontFamily: display, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: C.navy, letterSpacing: "-0.02em" }}>A conversation, not a search</h2>
        </div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {[
            ["01", "Tell Ruby about yourself", "Where you're coming from, what you do, how you like to live. No forms — just a real conversation."],
            ["02", "Ruby finds your match", "She weighs your budget, lifestyle, commute, and priorities against every Triangle neighborhood — then gives you her honest top picks."],
            ["03", "Connect with a specialist", "Ruby passes your full profile to a local specialist who knows exactly what you're looking for."],
          ].map(([num, title, desc]) => (
            <div className="step-card" key={num} style={{ padding: "32px 28px", border: `1px solid ${C.steel}`, borderRadius: 16, background: C.white, transition: "all 0.2s", cursor: "default" }}>
              <div style={{ fontFamily: display, fontSize: 42, fontWeight: 600, color: C.gold, marginBottom: 16, lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: display, fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 10 }}>{title}</div>
              <div style={{ fontFamily: body, fontSize: 14, color: C.textMid, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div style={{ background: C.navy, padding: "72px 40px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <img src={RUBY_BADGE} alt="Ruby" style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${C.gold}`, marginBottom: 20 }} onError={e => { e.target.style.display = "none"; }} />
          <h2 style={{ fontFamily: display, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 600, color: C.white, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Ready to find your spot?
          </h2>
          <p style={{ fontFamily: body, fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.6 }}>
            Ruby knows the Triangle. All 15 communities, real pricing, honest opinions.
          </p>
          <button className="cta-gold" onClick={startChat} style={{ background: C.gold, color: C.navy, border: "none", padding: "16px 48px", fontSize: 15, fontFamily: body, fontWeight: 700, cursor: "pointer", borderRadius: 10, transition: "all 0.2s" }}>
            Talk to Ruby →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "24px 40px", borderTop: `1px solid ${C.steel}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RubyBadge size={24} />
          <span style={{ fontFamily: display, fontSize: 15, fontWeight: 600, color: C.navy }}>Perch</span>
          <span style={{ fontFamily: body, fontSize: 12, color: C.textLight }}>· A ClubOS AI Experience</span>
        </div>
        <div style={{ fontFamily: body, fontSize: 12, color: C.textLight }}>perchtriangle.com · 2026</div>
      </div>
    </div>
  );

  // ── CHAT ──
  return (
    <div style={{ height: "100vh", background: C.offWhite, display: "flex", flexDirection: "column", fontFamily: body }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Chat header */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.steel}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 8px rgba(10,22,40,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <RubyBadge size={40} />
          <div>
            <div style={{ fontFamily: display, fontSize: 16, fontWeight: 600, color: C.navy }}>Ruby</div>
            <div style={{ fontFamily: body, fontSize: 11, color: C.textLight, fontWeight: 500 }}>Perch · Triangle Guide · ClubOS AI</div>
          </div>
          <div style={{ background: C.goldPale, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 100, padding: "3px 10px", marginLeft: 4 }}>
            <span style={{ fontFamily: body, fontSize: 10, fontWeight: 700, color: C.gold }}>● Online</span>
          </div>
        </div>
        <button onClick={() => { setScreen("landing"); setMessages([]); setShowForm(false); setFormDone(false); }} style={{ background: "none", border: `1px solid ${C.steel}`, color: C.textMid, fontFamily: body, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "7px 16px", borderRadius: 8 }}>
          ← Home
        </button>
      </div>

      {/* Messages — wider container to accommodate 3-card grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", maxWidth: 1000, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {loading && messages.length === 0 && <TypingDots />}
        {messages.map((msg, i) => (
          <div key={i}>
            <ChatMessage msg={msg} />
            {showForm && !formDone && msg.role === "assistant" && msg.content.includes("[SHOW_LEAD_FORM]") && i === messages.length - 1 && (
              <LeadForm summary={summary} onSubmit={handleLeadSubmit} onSkip={() => setShowForm(false)} />
            )}
          </div>
        ))}
        {loading && messages.length > 0 && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.steel}`, padding: "16px 24px", flexShrink: 0, boxShadow: "0 -2px 12px rgba(10,22,40,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tell Ruby about yourself — where you're from, what you do, how you like to live..."
            rows={1}
            style={{ flex: 1, background: C.offWhite, border: `1.5px solid ${C.steel}`, color: C.textDark, padding: "12px 16px", fontSize: 15, fontFamily: body, resize: "none", outline: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto", borderRadius: 10, transition: "border-color 0.2s" }}
            onFocus={e => { e.target.style.borderColor = C.navy; }}
            onBlur={e => { e.target.style.borderColor = C.steel; }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          />
          <button onClick={send} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? C.navy : C.steel, color: input.trim() && !loading ? C.white : C.textLight, border: "none", padding: "12px 20px", fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "all 0.2s", flexShrink: 0, borderRadius: 10 }}>↑</button>
        </div>
        <div style={{ maxWidth: 1000, margin: "8px auto 0", fontFamily: body, fontSize: 11, color: C.textLight }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
