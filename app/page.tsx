"use client";

import { useEffect, useMemo, useState } from "react";

type Memory = {
  id: string;
  text: string;
  timestamp: string;
  source: string;
  type: string;
  location: string | null;
  activity: string | null;
  category: string | null;
  confidence: number | null;
};

const API_URL = "";

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [text, setText] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadMemories() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/activities`);

      if (!response.ok) {
        throw new Error("Failed to load memories");
      }

      const data = await response.json();
      setMemories(data);
    } catch (error) {
      console.error(error);
      setMessage("Backend is not connected.");
    } finally {
      setLoading(false);
    }
  }

  async function saveMemory() {
    const value = text.trim();

    if (!value) {
      setMessage("Write something first.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`${API_URL}/api/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save memory");
      }

      setText("");
      setMessage("Memory saved.");

      await loadMemories();
    } catch (error) {
      console.error(error);
      setMessage("Could not save memory.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, []);

  const todayMemories = useMemo(() => {
    const today = new Date();

    return memories.filter((memory) => {
      const date = new Date(memory.timestamp);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    });
  }, [memories]);

  function formatDate(timestamp: string) {
    try {
      const date = new Date(timestamp);

      return date.toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  }

  function formatTime(timestamp: string) {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  return (
    <main className="app-shell">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-orb">F</div>

          <div>
            <div className="brand-name">FLEROVIUM</div>
            <div className="brand-subtitle">Personal Intelligence</div>
          </div>
        </div>

        <nav className="navigation">
          <NavButton
            icon="⌂"
            label="Home"
            active={activeSection === "home"}
            onClick={() => setActiveSection("home")}
          />

          <NavButton
            icon="◷"
            label="Timeline"
            active={activeSection === "timeline"}
            onClick={() => setActiveSection("timeline")}
          />

          <NavButton
            icon="◈"
            label="Memory"
            active={activeSection === "memory"}
            onClick={() => setActiveSection("memory")}
          />

          <NavButton
            icon="⌁"
            label="Analysis"
            active={activeSection === "analysis"}
            onClick={() => setActiveSection("analysis")}
          />

          <NavButton
            icon="✦"
            label="AI"
            active={activeSection === "ai"}
            onClick={() => setActiveSection("ai")}
          />
        </nav>

        <div className="sidebar-status">
          <div className="status-dot" />
          <span>Flerovium online</span>
        </div>
      </aside>

      {/* MAIN */}

      <section className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">PERSONAL AI SYSTEM</div>

            <h1>
              {activeSection === "home" && "Good evening."}
              {activeSection === "timeline" && "Timeline"}
              {activeSection === "memory" && "Memory"}
              {activeSection === "analysis" && "Analysis"}
              {activeSection === "ai" && "Flerovium AI"}
            </h1>
          </div>

          <div className="system-pill">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>
        </header>

        {/* HOME */}

        {activeSection === "home" && (
          <>
            <section className="hero-panel">
              <div>
                <div className="hero-label">YOUR PERSONAL MEMORY SYSTEM</div>

                <h2>
                  Everything you experience
                  <br />
                  can become a memory.
                </h2>

                <p>
                  Capture what happened. Flerovium will gradually learn how
                  your life, work and habits fit together.
                </p>
              </div>

              <div className="hero-orbit">
                <div className="orbit-ring ring-one" />
                <div className="orbit-ring ring-two" />
                <div className="orbit-core">F</div>
              </div>
            </section>

            {/* CAPTURE */}

            <section className="capture-panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">CAPTURE</div>
                  <h3>What happened?</h3>
                </div>

                <span className="capture-hint">Natural language</span>
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Example: I reached office at 9:15 AM and started working on compressor spare reconciliation."
              />

              <div className="capture-footer">
                <span>
                  {text.length > 0
                    ? `${text.length} characters`
                    : "Describe anything you want Flerovium to remember."}
                </span>

                <button
                  className="primary-button"
                  onClick={saveMemory}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Memory →"}
                </button>
              </div>

              {message && <div className="message">{message}</div>}
            </section>

            {/* QUICK STATS */}

            <section className="stats-grid">
              <StatCard
                title="Today"
                value={todayMemories.length.toString()}
                subtitle="memories captured"
              />

              <StatCard
                title="Total"
                value={memories.length.toString()}
                subtitle="stored memories"
              />

              <StatCard
                title="Status"
                value="ONLINE"
                subtitle="memory system"
              />
            </section>

            {/* RECENT */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">RECENT</div>
                  <h3>Latest memories</h3>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActiveSection("timeline")}
                >
                  View timeline →
                </button>
              </div>

              {loading ? (
                <div className="empty-state">Loading memories...</div>
              ) : memories.length === 0 ? (
                <div className="empty-state">
                  No memories yet. Capture your first one above.
                </div>
              ) : (
                <div className="memory-grid">
                  {memories.slice(0, 5).map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* TIMELINE */}

        {activeSection === "timeline" && (
          <section className="section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">CHRONOLOGICAL MEMORY</div>
                <h3>Your timeline</h3>
              </div>
            </div>

            {memories.length === 0 ? (
              <div className="empty-state">No memories yet.</div>
            ) : (
              <div className="timeline">
                {memories.map((memory, index) => (
                  <div className="timeline-item" key={memory.id}>
                    <div className="timeline-time">
                      {formatTime(memory.timestamp)}
                    </div>

                    <div className="timeline-line">
                      <div className="timeline-dot" />

                      {index !== memories.length - 1 && (
                        <div className="timeline-connector" />
                      )}
                    </div>

                    <MemoryCard
                      memory={memory}
                      formatDate={formatDate}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MEMORY */}

        {activeSection === "memory" && (
          <section className="section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">LONG TERM MEMORY</div>
                <h3>Everything Flerovium remembers</h3>
              </div>
            </div>

            <div className="memory-search">
              <input
                placeholder="Search memories..."
                onChange={(event) => {
                  const query = event.target.value.toLowerCase();

                  if (!query) {
                    loadMemories();
                    return;
                  }

                  setMemories((current) =>
                    current.filter((memory) =>
                      memory.text.toLowerCase().includes(query)
                    )
                  );
                }}
              />
            </div>

            <div className="memory-grid">
              {memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </section>
        )}

        {/* ANALYSIS */}

        {activeSection === "analysis" && (
          <section className="section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">BEHAVIOUR ENGINE</div>
                <h3>Analysis</h3>
              </div>
            </div>

            <div className="analysis-grid">
              <AnalysisCard
                title="Patterns"
                description="Flerovium will identify recurring activities, routines and behaviours."
              />

              <AnalysisCard
                title="Habits"
                description="Repeated actions will eventually become measurable patterns."
              />

              <AnalysisCard
                title="Forecast"
                description="Future behaviour predictions will be generated from accumulated evidence."
              />
            </div>

            <div className="coming-soon">
              <span>ANALYSIS ENGINE</span>
              <strong>Not connected yet</strong>
              <p>
                This section will become active after enough structured
                memories have been collected.
              </p>
            </div>
          </section>
        )}

        {/* AI */}

        {activeSection === "ai" && (
          <section className="section">
            <div className="ai-panel">
              <div className="ai-orb">F</div>

              <div>
                <div className="eyebrow">FLEROVIUM INTELLIGENCE</div>

                <h3>Talk to your digital companion.</h3>

                <p>
                  Ollama will eventually connect here so Flerovium can reason
                  over your memories, behaviour and personal context.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setMessage("AI engine will be connected next.")
                  }
                >
                  Initialize AI
                </button>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

/* ---------------------------------------------------------- */
/* COMPONENTS */
/* ---------------------------------------------------------- */

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </div>
  );
}

function AnalysisCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="analysis-card">
      <div className="analysis-icon">✦</div>

      <h4>{title}</h4>

      <p>{description}</p>

      <span>COMING SOON</span>
    </div>
  );
}

function MemoryCard({
  memory,
  formatDate,
}: {
  memory: Memory;
  formatDate: (timestamp: string) => string;
}) {
  return (
    <article className="memory-card">
      <div className="memory-card-header">
        <div className="memory-icon">✦</div>

        <span>{formatDate(memory.timestamp)}</span>
      </div>

      <p className="memory-text">{memory.text}</p>

      <div className="memory-tags">
        {memory.category && (
          <span className="tag">◈ {memory.category}</span>
        )}

        {memory.activity && (
          <span className="tag">⌁ {memory.activity}</span>
        )}

        {memory.location && (
          <span className="tag">⌖ {memory.location}</span>
        )}

        <span className="tag">◉ {memory.source}</span>

        {memory.confidence !== null && (
          <span className="tag">
            {Math.round(memory.confidence * 100)}% confidence
          </span>
        )}
      </div>
    </article>
  );
}