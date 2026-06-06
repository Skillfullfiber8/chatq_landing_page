import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design tokens ─────────────────────────────────────────────
const T = {
  bg: "#070711",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(124,58,237,0.45)",
  violet: "#7c3aed",
  violetDark: "#5b21b6",
  violetLight: "#a78bfa",
  cyan: "#06b6d4",
  text: "#f1f0ff",
  textSub: "#d4d4f0",
  muted: "#6b6b8a",
  green: "#25d366",
  pink: "#e1306c",
};

const grad = `linear-gradient(135deg,${T.violet},${T.violetDark})`;
const gradText = `linear-gradient(135deg,${T.violetLight},${T.cyan})`;

// ─── Helpers ───────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    style={style}
  >
    {children}
  </motion.div>
);

function GlassCard({ children, style = {}, hover = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 20,
        backdropFilter: "blur(20px)",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: hovered ? "0 0 30px -5px rgba(124,58,237,0.35)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GradText({ children }) {
  return (
    <span style={{ background: gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ color: T.violet, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </p>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Services", "How It Works", "Pricing", "FAQ", "Contact"];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(7,7,17,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "all 0.3s",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: "-0.02em" }}>
            Chat<span style={{ color: T.violetLight }}>Q</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-links">
          {links.map((l) => (
            <NavLink key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</NavLink>
          ))}
        </div>

        {/* CTA */}
        <HoverBtn
          onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
          style={{ background: grad, color: "#fff", boxShadow: "0 0 22px rgba(124,58,237,0.45)", padding: "10px 22px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          className="desktop-cta"
        >
          Book Free Demo
        </HoverBtn>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", padding: 8, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", flexDirection: "column", gap: 5 }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", width: 20, height: 2, background: T.text, borderRadius: 1, transition: "all 0.2s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)") : "none" }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: "rgba(7,7,17,0.97)", borderTop: `1px solid ${T.border}`, padding: "12px 24px 20px" }}
          >
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "14px 0", borderBottom: `1px solid ${T.border}`, color: T.textSub, fontSize: 14, textDecoration: "none" }}>
                {l}
              </a>
            ))}
            <button onClick={() => { setMenuOpen(false); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }} style={{ marginTop: 16, width: "100%", padding: "14px", background: grad, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Book Free Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ color: hov ? T.text : T.muted, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}>
      {children}
    </a>
  );
}

function HoverBtn({ children, style = {}, onClick, className }) {
  const [hov, setHov] = useState(false);
  return (
    <button className={className} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...style, transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform 0.18s" }}>
      {children}
    </button>
  );
}

// ─── ANIMATED FLOW ─────────────────────────────────────────────
const flowSteps = [
  { label: "Instagram DM",   icon: "📸", color: T.pink,        bg: "rgba(225,48,108,0.12)",  border: "rgba(225,48,108,0.35)" },
  { label: "ChatQ AI",       icon: "⚡", color: T.violetLight, bg: "rgba(124,58,237,0.16)",  border: "rgba(167,139,250,0.45)" },
  { label: "WhatsApp Reply", icon: "💬", color: T.green,       bg: "rgba(37,211,102,0.1)",   border: "rgba(37,211,102,0.35)" },
  { label: "Lead Captured",  icon: "✅", color: T.cyan,        bg: "rgba(6,182,212,0.1)",    border: "rgba(6,182,212,0.4)" },
];

function AnimatedFlow() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % flowSteps.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {flowSteps.map((step, i) => (
        <div key={step.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div
            animate={{
              scale: active === i ? 1.05 : 1,
              boxShadow: active === i ? `0 0 28px ${step.color}55` : "0 0 0 transparent",
            }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 20px", borderRadius: 16, minWidth: 220,
              background: active === i ? step.bg : "rgba(255,255,255,0.03)",
              border: `1px solid ${active === i ? step.border : T.border}`,
            }}
          >
            <span style={{ fontSize: 20 }}>{step.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: active === i ? step.color : T.muted }}>
              {step.label}
            </span>
            {active === i && (
              <motion.div
                style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: step.color }}
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </motion.div>
          {i < flowSteps.length - 1 && (
            <motion.div
              style={{ width: 1, height: 28, margin: "4px 0" }}
              animate={{ background: active > i ? `linear-gradient(${T.violet},${T.cyan})` : T.border }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 64px", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${T.violet},transparent 70%)`, filter: "blur(90px)", opacity: 0.18 }} />
        <div style={{ position: "absolute", bottom: "15%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${T.cyan},transparent 70%)`, filter: "blur(90px)", opacity: 0.13 }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }} className="hero-grid">
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 99, background: "rgba(124,58,237,0.12)", border: `1px solid rgba(124,58,237,0.3)`, color: T.violetLight, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.violetLight, animation: "pulse 2s infinite" }} />
            AI-Powered Automation for Indian Businesses
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 900, lineHeight: 1.07, letterSpacing: "-0.02em", color: T.text, margin: 0 }}>
            Turn Every<br />
            <GradText>Conversation</GradText><br />
            Into a Customer.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ marginTop: 20, fontSize: 17, lineHeight: 1.7, color: T.muted, maxWidth: 460 }}>
            ChatQ automates WhatsApp and Instagram inquiries, captures leads, and helps your business grow — 24/7, without hiring extra staff.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }}
            style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
            <HoverBtn
              onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
              style={{ background: grad, color: "#fff", boxShadow: "0 0 30px rgba(124,58,237,0.5)", padding: "14px 28px", borderRadius: 16, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              Book Free Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </HoverBtn>
            <HoverBtn
              onClick={() => document.getElementById("live-demo").scrollIntoView({ behavior: "smooth" })}
              style={{ background: "transparent", color: T.textSub, border: `1px solid ${T.border}`, padding: "14px 28px", borderRadius: 16, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/></svg>
              Watch Demo
            </HoverBtn>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: 40, marginTop: 44, flexWrap: "wrap" }}>
            {[["500+", "Leads Captured"], ["3x", "Faster Response"], ["24/7", "Automation"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 800, color: T.violetLight }}>{n}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "flex-end" }} className="hero-right">
          <div style={{ position: "relative" }}>
            <GlassCard hover={false} style={{ padding: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: T.muted, textAlign: "center", marginBottom: 24, textTransform: "uppercase" }}>
                Live Automation Flow
              </div>
              <AnimatedFlow />
              <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: T.muted }}>
                Processing 1,247 messages today
              </div>
            </GlassCard>
            <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(135deg,${T.violet},${T.cyan})`, filter: "blur(40px)", opacity: 0.25, zIndex: -1 }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── WHO WE HELP ───────────────────────────────────────────────
const niches = [
  { icon: "🏥", label: "Clinics" }, { icon: "💪", label: "Gyms" },
  { icon: "📚", label: "Coaching Centers" }, { icon: "🏠", label: "Real Estate" },
  { icon: "🛍️", label: "Local Businesses" }, { icon: "🎨", label: "Creators" },
];

function WhoWeHelp() {
  return (
    <section style={{ padding: "48px 24px", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ color: T.muted, fontSize: 13 }}>Trusted by businesses across India</p>
        </FadeUp>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {niches.map((n, i) => <NicheChip key={n.label} n={n} delay={i * 0.06} />)}
        </div>
      </div>
    </section>
  );
}

function NicheChip({ n, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeUp delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, border: `1px solid ${hov ? "rgba(124,58,237,0.35)" : T.border}`, background: hov ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.02)", cursor: "default", transition: "all 0.2s" }}>
        <span style={{ fontSize: 18 }}>{n.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.textSub }}>{n.label}</span>
      </div>
    </FadeUp>
  );
}

// ─── SERVICES ──────────────────────────────────────────────────
const services = [
  { icon: "💬", title: "WhatsApp Automation", desc: "Answer FAQs, qualify leads, and book appointments — automatically, around the clock.", color: T.green, bg: "rgba(37,211,102,0.08)", wide: true },
  { icon: "📸", title: "Instagram Automation", desc: "Turn every DM into a real business opportunity. Never miss a lead again.", color: T.pink, bg: "rgba(225,48,108,0.08)", wide: false },
  { icon: "🌐", title: "Website Development", desc: "Modern, conversion-focused websites that make your business look world-class.", color: T.cyan, bg: "rgba(6,182,212,0.08)", wide: false },
  { icon: "📈", title: "Lead Capture System", desc: "Every inquiry collected, organized, and ready to follow up — zero manual effort.", color: T.violetLight, bg: "rgba(167,139,250,0.08)", wide: true },
];

function Services() {
  return (
    <section id="services" style={{ padding: "112px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>What We Build</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: T.text, margin: 0, lineHeight: 1.15 }}>
            Everything you need to<br /><GradText>stop losing customers</GradText>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="services-grid">
          {services.map((s, i) => <ServiceCard key={s.title} s={s} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeUp delay={delay} style={s.wide ? { gridColumn: "span 2" } : {}}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ padding: 28, borderRadius: 20, background: T.surface, border: `1px solid ${hov ? s.color + "55" : T.border}`, boxShadow: hov ? `0 0 30px -8px ${s.color}44` : "none", transition: "all 0.25s", height: "100%", boxSizing: "border-box" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18, transform: hov ? "scale(1.1)" : "scale(1)", transition: "transform 0.25s" }}>{s.icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{s.title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: T.muted, margin: "0 0 18px" }}>{s.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color }}>
          Learn more
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </FadeUp>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────
const steps = [
  { num: "01", icon: "🔗", title: "Connect Your Business", desc: "We learn about your services, FAQs, and goals. A 30-minute call is all it takes." },
  { num: "02", icon: "⚙️", title: "Set Up Automation", desc: "ChatQ configures smart responses for WhatsApp and Instagram tailored to your business." },
  { num: "03", icon: "🎯", title: "Capture Every Lead", desc: "Every inquiry is automatically collected, organized, and ready for follow-up." },
  { num: "04", icon: "🚀", title: "Watch Your Business Grow", desc: "Spend less time answering questions. More time serving customers." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "112px 24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: `radial-gradient(ellipse,${T.violet},transparent 70%)`, filter: "blur(70px)", opacity: 0.09, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>The Process</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: T.text, margin: 0 }}>
            Up and running in <GradText>3 days</GradText>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="steps-grid">
          {steps.map((s, i) => (
            <FadeUp key={s.num} delay={i * 0.12}>
              <GlassCard style={{ padding: 24, height: "100%", boxSizing: "border-box", position: "relative" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: T.violetLight, opacity: 0.25, lineHeight: 1, marginBottom: 12 }}>{s.num}</div>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, margin: 0 }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -10, fontSize: 20, color: "#3d3d5c", transform: "translateY(-50%)" }}>›</div>
                )}
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CHAT DEMO ─────────────────────────────────────────────────
const demos = {
  clinic: {
    label: "🏥 Dental Clinic",
    messages: [
      { from: "user", text: "What are your consultation charges?" },
      { from: "bot",  text: "Consultation starts at ₹500. Would you like to book an appointment? 😊" },
      { from: "user", text: "Yes, please!" },
      { from: "bot",  text: "Great! Please select your preferred date. We have slots tomorrow at 10am, 2pm, and 5pm." },
      { from: "user", text: "Tomorrow 10am works!" },
      { from: "bot",  text: "✅ Booked! You'll receive a WhatsApp confirmation shortly. See you at 10am!" },
    ],
  },
  gym: {
    label: "💪 Gym",
    messages: [
      { from: "user", text: "What are your membership plans?" },
      { from: "bot",  text: "We have 3 plans: Monthly ₹999, Quarterly ₹2,499, Annual ₹7,999. Which interests you?" },
      { from: "user", text: "Monthly. Can I get a free trial?" },
      { from: "bot",  text: "Absolutely! Come in for a free 1-day trial. Would you like to schedule it this week?" },
      { from: "user", text: "Saturday works for me!" },
      { from: "bot",  text: "🎉 Saturday it is! Arrive at 9am, ask for the front desk. See you!" },
    ],
  },
  creator: {
    label: "🎨 Creator",
    messages: [
      { from: "user", text: "How much does a custom logo cost?" },
      { from: "bot",  text: "Custom logos start at ₹2,999 — includes 3 concepts + unlimited revisions. Interested?" },
      { from: "user", text: "What's the delivery time?" },
      { from: "bot",  text: "First drafts in 48 hours, final delivery in 5–7 days. 200+ happy clients!" },
      { from: "user", text: "I'm sold. How do I get started?" },
      { from: "bot",  text: "🚀 Awesome! Fill this quick form and we'll reach out within the hour: chatq.in/start" },
    ],
  },
};

function ChatDemo() {
  const [activeDemo, setActiveDemo] = useState("clinic");
  const [count, setCount] = useState(0);
  const msgs = demos[activeDemo].messages;

  useEffect(() => {
    setCount(0);
    const t = setInterval(() => {
      setCount((c) => { if (c >= msgs.length) { clearInterval(t); return c; } return c + 1; });
    }, 900);
    return () => clearInterval(t);
  }, [activeDemo, msgs.length]);

  return (
    <section id="live-demo" style={{ padding: "112px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel>Live Demo</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: T.text, margin: "0 0 12px" }}>See ChatQ in action</h2>
          <p style={{ fontSize: 15, color: T.muted, margin: 0 }}>Watch how it handles real customer conversations</p>
        </FadeUp>

        {/* Tab switcher */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          {Object.entries(demos).map(([key, val]) => (
            <button key={key} onClick={() => setActiveDemo(key)}
              style={{ padding: "10px 20px", borderRadius: 12, border: `1px solid ${activeDemo === key ? "rgba(124,58,237,0.5)" : T.border}`, background: activeDemo === key ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.02)", color: activeDemo === key ? T.violetLight : T.muted, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              {val.label}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <GlassCard hover={false} style={{ overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>ChatQ Bot</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: T.muted }}>Online · Replies instantly</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: 20, minHeight: 300, display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatePresence mode="popLayout">
                {msgs.slice(0, count).map((msg, i) => (
                  <motion.div key={`${activeDemo}-${i}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.28 }}
                    style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "80%", padding: "10px 16px", borderRadius: 18, fontSize: 13, lineHeight: 1.55,
                      ...(msg.from === "user"
                        ? { background: grad, color: "#fff", borderBottomRightRadius: 4 }
                        : { background: "rgba(255,255,255,0.07)", color: T.textSub, borderBottomLeftRadius: 4 }),
                    }}>{msg.text}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {count < msgs.length && (
                <div style={{ display: "flex", gap: 5, padding: "4px 8px" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ───────────────────────────────────────────────────
const plans = [
  { name: "Starter", price: "₹4,999", period: "one-time", desc: "Perfect for getting online", highlight: false, cta: "Get Started",
    features: ["Landing page", "WhatsApp integration", "Mobile responsive", "1 month support"] },
  { name: "Growth",  price: "₹9,999", period: "one-time", desc: "For businesses ready to scale", highlight: true, cta: "Get Started",
    features: ["Full website", "WhatsApp automation", "Instagram automation", "Lead capture system", "3 months support"] },
  { name: "Custom",  price: "Let's talk", period: "", desc: "Enterprise & advanced needs", highlight: false, cta: "Contact Us",
    features: ["Advanced AI chatbot", "CRM integration", "Multi-platform", "Priority support", "Custom everything"] },
];

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "112px 24px", position: "relative" }}>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 600, height: 400, background: `radial-gradient(ellipse,${T.cyan},transparent 70%)`, filter: "blur(80px)", opacity: 0.08, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>Pricing</SectionLabel>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: T.text, margin: 0, lineHeight: 1.2 }}>
            Simple, transparent <GradText>pricing</GradText>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }} className="plans-grid">
          {plans.map((plan, i) => <PlanCard key={plan.name} plan={plan} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, delay }) {
  return (
    <FadeUp delay={delay}>
      <div style={{ position: "relative", height: "100%" }}>
        {plan.highlight && (
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: grad, color: "#fff", padding: "4px 16px", borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", zIndex: 2 }}>
            Most Popular
          </div>
        )}
        <div style={{ padding: 28, borderRadius: 20, background: T.surface, border: `1px solid ${plan.highlight ? "rgba(124,58,237,0.5)" : T.border}`, boxShadow: plan.highlight ? "0 0 40px -10px rgba(124,58,237,0.5)" : "none", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>{plan.name}</h3>
          <p style={{ fontSize: 13, color: T.muted, margin: "0 0 20px" }}>{plan.desc}</p>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 30, fontWeight: 900, color: plan.highlight ? T.violetLight : T.text }}>{plan.price}</span>
            {plan.period && <span style={{ fontSize: 13, color: T.muted, marginLeft: 6 }}>{plan.period}</span>}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            {plan.features.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: T.textSub }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(124,58,237,0.2)"/><path d="M5 8l2 2 4-4" stroke={T.violetLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <HoverBtn
            onClick={() => {
              if (plan.cta === "Contact Us") {
                const text = encodeURIComponent(`Hi ChatQ! I'm interested in the *Custom Plan*. Can you share more details?`);
                window.open(`https://wa.me/919786210101?text=${text}`, "_blank");
              } else {
                document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
              ...(plan.highlight ? { background: grad, color: "#fff", boxShadow: "0 0 20px rgba(124,58,237,0.4)" } : { background: "rgba(255,255,255,0.06)", color: T.textSub, border: `1px solid ${T.border}` }) }}>
            {plan.cta}
          </HoverBtn>
        </div>
      </div>
    </FadeUp>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────
const faqs = [
  { q: "Do I need a website to use ChatQ?", a: "No. ChatQ can work directly with your existing WhatsApp and Instagram accounts. A website is optional." },
  { q: "How long does setup take?", a: "Usually 1–3 days. We handle all the technical setup — you just need to provide info about your business." },
  { q: "Can ChatQ answer customer questions automatically?", a: "Yes. We configure automated responses based on your specific business, services, and FAQs." },
  { q: "Is there ongoing support?", a: "Absolutely. All plans include a support period. We also offer monthly retainer plans for continuous updates." },
  { q: "Which businesses is ChatQ best for?", a: "Clinics, gyms, coaching centers, real estate agents, local businesses, and creators. Anyone who gets DMs." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "112px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <FadeUp style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: T.text, margin: 0 }}>Common questions</h2>
        </FadeUp>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <GlassCard hover={false} onClick={() => setOpen(open === i ? null : i)} style={{ overflow: "hidden", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 24px" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{faq.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: `1px solid rgba(255,255,255,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color: T.violetLight, fontSize: 16, fontWeight: 300 }}>
                    +
                  </motion.span>
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                      <div style={{ padding: "0 24px 18px", fontSize: 13, lineHeight: 1.7, color: T.muted }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ───────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", business: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.business || !form.phone) return;
    const text = `Hi ChatQ! I'd like to book a free demo.

*Name:* ${form.name}
*Business:* ${form.business}
*Phone:* ${form.phone}
*Message:* ${form.message || "No additional message"}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919786210101?text=${encoded}`, "_blank");
    setSent(true);
  };

  return (
    <section id="contact" style={{ padding: "112px 24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 500, height: 500, background: `radial-gradient(ellipse,${T.violet},transparent 70%)`, filter: "blur(80px)", opacity: 0.09, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }} className="contact-grid">
        <FadeUp>
          <SectionLabel>Get Started</SectionLabel>
          <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: T.text, margin: "0 0 16px", lineHeight: 1.15 }}>
            Ready to automate <GradText>your business?</GradText>
          </h2>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>
            Book a free 30-minute demo call. We'll show you exactly how ChatQ works for your specific business — no pressure, no fluff.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { href: "https://wa.me/919786210101", icon: "💬", label: "Chat on WhatsApp", sub: "Fastest response · Replies in minutes", color: T.green, bg: "rgba(37,211,102,0.1)", border: "rgba(37,211,102,0.2)" },
              { href: "mailto:chatqdm@gmail.com", icon: "📧", label: "chatqdm@gmail.com", sub: "For proposals and detailed queries", color: T.violetLight, bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
            ].map((item) => <ContactLink key={item.label} {...item} />)}
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <GlassCard hover={false} style={{ padding: 32 }}>
            {!sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Book Free Demo</h3>
                {[
                  { key: "name", placeholder: "Your name", type: "text" },
                  { key: "business", placeholder: "Business name", type: "text" },
                  { key: "phone", placeholder: "Phone number", type: "tel" },
                ].map(({ key, placeholder, type }) => (
                  <ContactInput key={key} type={type} placeholder={placeholder} value={form[key]}
                    onChange={(v) => setForm({ ...form, [key]: v }) } />
                ))}
                <ContactTextarea value={form.message} onChange={(v) => setForm({ ...form, message: v })} />
                <HoverBtn
                  onClick={handleSubmit}
                  style={{ width: "100%", padding: "14px 0", background: grad, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}>
                  Book Free Demo →
                </HoverBtn>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8 }}>We'll be in touch soon!</h3>
                <p style={{ fontSize: 13, color: T.muted }}>Check your WhatsApp — we usually respond within the hour.</p>
              </motion.div>
            )}
          </GlassCard>
        </FadeUp>
      </div>
    </section>
  );
}

function ContactLink({ href, icon, label, sub, color, bg, border }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, border: `1px solid ${hov ? color + "55" : T.border}`, background: hov ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)", textDecoration: "none", transition: "all 0.2s" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{label}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{sub}</div>
      </div>
    </a>
  );
}

function ContactInput({ type, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} required value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${focused ? "rgba(124,58,237,0.5)" : T.border}`, borderRadius: 12, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
  );
}

function ContactTextarea({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea placeholder="Tell us about your business..." rows={3} value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${focused ? "rgba(124,58,237,0.5)" : T.border}`, borderRadius: 12, color: T.text, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" }} />
  );
}

// ─── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: "40px 24px", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: T.text, letterSpacing: "-0.02em" }}>Chat<span style={{ color: T.violetLight }}>Q</span></span>
        </div>
        <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>© 2025 ChatQ. Turning conversations into customers.</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map((l) => <FooterLink key={l}>{l}</FooterLink>)}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href="#" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontSize: 12, color: hov ? T.textSub : T.muted, textDecoration: "none", transition: "color 0.2s" }}>
      {children}
    </a>
  );
}

// ─── GLOBAL STYLES + APP ───────────────────────────────────────
const css = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #070711; color: #f1f0ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  ::placeholder { color: #6b6b8a; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  @media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr !important; }
    .hero-right { justify-content: center !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .services-grid > * { grid-column: span 1 !important; }
    .steps-grid { grid-template-columns: 1fr 1fr !important; }
    .plans-grid { grid-template-columns: 1fr !important; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .desktop-links { display: none !important; }
    .desktop-cta { display: none !important; }
    .hamburger { display: flex !important; }
  }
  @media (max-width: 480px) {
    .steps-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function App() {
  return (
    <>
      <style>{css}</style>
      <div style={{ background: "#070711", minHeight: "100vh" }}>
        <Navbar />
        <Hero />
        <WhoWeHelp />
        <Services />
        <HowItWorks />
        <ChatDemo />
        <Pricing />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </>
  );
}