import React, { useState, useRef, useEffect } from "react";

// --- Types ---
type Message = { text: string; sender: "bot" | "user" };

// --- Categorized Data ---
const categories = [
  {
    id: "hero",
    title: "🛡️ The Civic Hero Concept",
    items: [
      { q: "What is a 'Civic Hero'?", a: "A Civic Hero is a citizen who takes ownership of their community. By reporting issues like potholes or broken lights, you help the government prioritize repairs." },
      { q: "How is this different from old portals?", a: "Unlike old portals, we offer 'Pizza-style' tracking. You see exactly when a technician is assigned and when the job is done." },
      { q: "What are 'Hero Points'?", a: "Points are rewarded for valid reports and successful resolutions. They reflect your impact and rank you on the leaderboard." },
      { q: "Can I earn badges?", a: "Yes! Consistently helping improve city infrastructure earns you badges like 'Pothole Patrol' or 'Light Bringer'." }
    ]
  },
  {
    id: "reporting",
    title: "📸 Reporting & Multimedia",
    items: [
      { q: "How do I report an issue?", a: "Open the 'Report' section, take a photo, and add an optional voice note. The system automatically captures your GPS coordinates." },
      { q: "How does the voice note work?", a: "You can record a voice note to describe the context (e.g., 'Loose manhole cover near the park') instead of typing while walking." },
      { q: "What if the GPS location is wrong?", a: "You can manually drag the pin on our interactive map to ensure the repair crew finds the exact spot." },
      { q: "Why is a photo required?", a: "Photos provide visual proof and allow departments to assess the severity and tools needed before arriving." }
    ]
  },
  {
    id: "tracking",
    title: "📍 Tracking & Progress",
    items: [
      { q: "How do I track my complaint?", a: "Your dashboard shows a visual timeline: Submitted, Verified, Assigned, In-Progress, and Resolved." },
      { q: "Who fixes the reported issues?", a: "Reports are routed to departments like Sanitation, Electricity, or Public Works based on the category you select." },
      { q: "Can I see other reports?", a: "Yes! The community map shows all active reports to prevent duplicates and show local concerns." },
      { q: "What does 'In-Progress' mean?", a: "It means a work order is issued and a field team is dispatched or scheduled for that location." }
    ]
  },
  {
    id: "gov",
    title: "🏛️ Government Dashboard",
    items: [
      { q: "What is the Gov Dashboard?", a: "It's an interface for officials to track live stats, monitor department speed, and view city-wide clusters." },
      { q: "What is 'Issue Clustering'?", a: "Our AI groups similar reports nearby so the government can fix multiple issues in one trip, saving time." },
      { q: "How are heatmaps used?", a: "Heatmaps show high-density problem areas, helping officials allocate budgets where they are most needed." },
      { q: "Can officials respond to me?", a: "Yes, officials can comment on your report for more details or provide specific repair updates." }
    ]
  },
  {
    id: "privacy",
    title: "⚖️ Privacy & Security",
    items: [
      { q: "Is my data safe?", a: "We only share report details/location with officials. Your private contact info is never public on the map." },
      { q: "How do you stop fake reports?", a: "We use AI image analysis and GPS metadata verification to filter out spam and ensure authenticity." },
      { q: "Can I delete a report?", a: "You can withdraw a report if filed by mistake, provided the government hasn't started the work yet." },
      { q: "What if a fix is poor quality?", a: "You can 'Re-Open' a ticket within 48 hours if the problem persists, alerting a supervisor." }
    ]
  }
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Greetings, Civic Hero! 🛡️ Select a category below to learn how we bridge the community divide.", sender: "bot" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedCat]);

  const handleQuestionClick = (q: string, a: string) => {
    setMessages(prev => [...prev, { text: q, sender: "user" }, { text: a, sender: "bot" }]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div 
        onClick={() => setOpen(!open)} 
        style={{ 
          position: "fixed", bottom: "30px", right: "30px", width: "70px", height: "70px", 
          borderRadius: "50%", background: "#4f8ef7", display: "flex", alignItems: "center", 
          justifyContent: "center", cursor: "pointer", zIndex: 10000, 
          boxShadow: "0 10px 40px rgba(79,142,247,0.5)", fontSize: "28px" 
        }}
      >
        {open ? <span style={{ color: "white" }}>✕</span> : "💬"}
      </div>

      {/* Main UI Container (40% Width) */}
      {open && (
        <div 
          onWheel={(e) => e.stopPropagation()} 
          style={{ 
            position: "fixed", top: "0", right: "0", width: "40%", height: "100vh", 
            background: "#0a0a0a", borderLeft: "2px solid #1e1e1e", display: "flex",
            flexDirection: "column", zIndex: 9999, boxShadow: "-15px 0 40px rgba(0,0,0,0.8)",
            animation: "slideIn 0.3s ease-out"
          }}
        >
          {/* Header */}
          <div style={{ padding: "25px", borderBottom: "1px solid #222", background: "#111", flexShrink: 0 }}>
            <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>CivicSync Assistant</div>
            <div style={{ color: "#4f8ef7", fontSize: "12px", marginTop: "4px" }}>Active • Online Help</div>
          </div>

          {/* Independent Scrollable Area */}
          <div 
            ref={scrollRef} 
            style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" }}
          >
            {/* Chat History */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ 
                  maxWidth: "85%", padding: "12px 16px", borderRadius: "15px", fontSize: "14px",
                  alignSelf: m.sender === "bot" ? "flex-start" : "flex-end",
                  background: m.sender === "bot" ? "#1e1e1e" : "#4f8ef7",
                  color: m.sender === "bot" ? "#ccc" : "#fff",
                  borderBottomLeftRadius: m.sender === "bot" ? "2px" : "15px",
                  borderBottomRightRadius: m.sender === "user" ? "2px" : "15px",
                }}>
                  {m.text}
                </div>
              ))}
            </div>

            {/* Dynamic Question Rendering Area */}
            <div style={{ borderTop: "1px solid #222", paddingTop: "20px", marginTop: "auto" }}>
              {!selectedCat ? (
                // --- VIEW 1: Category Menu ---
                <>
                  <div style={{ color: "#666", fontSize: "11px", fontWeight: 700, marginBottom: "15px", letterSpacing: "1px" }}>
                    SELECT A TOPIC
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {categories.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCat(cat.id)}
                        style={{ 
                          padding: "15px", background: "#161616", border: "1px solid #262626", 
                          color: "#fff", borderRadius: "10px", textAlign: "left", cursor: "pointer",
                          fontSize: "14px", transition: "0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = "#4f8ef7"}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = "#262626"}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                // --- VIEW 2: Questions within Category ---
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <div style={{ color: "#4f8ef7", fontSize: "12px", fontWeight: 700 }}>
                      {categories.find(c => c.id === selectedCat)?.title}
                    </div>
                    <button 
                      onClick={() => setSelectedCat(null)}
                      style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "12px" }}
                    >
                      ← Back to Menu
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {categories.find(c => c.id === selectedCat)?.items.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleQuestionClick(item.q, item.a)}
                        style={{ 
                          padding: "12px", background: "#1a1a1a", border: "1px solid #333", 
                          color: "#bbb", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontSize: "13px"
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#fff"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#bbb"; }}
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        div::-webkit-scrollbar { width: 5px; }
        div::-webkit-scrollbar-track { background: #0a0a0a; }
        div::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </>
  );
}