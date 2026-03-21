import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  FolderOpen,
  ChevronRight,
  Flame,
  BarChart2,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ================= TYPES ================= */

interface AssignedIssue {
  id: number;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved";
  project_name: string;
  due_date?: string;
  created_at: string;
}

interface UserProject {
  id: number;
  name: string;
  role: string;
  open_issues: number;
  total_issues: number;
  last_activity: string;
}

interface UserDashboardData {
  user: {
    name: string;
    avatar_initials: string;
    role: string;
  };
  assignedIssues: AssignedIssue[];
  projects: UserProject[];
  stats: {
    totalAssigned: number;
    resolvedThisWeek: number;
    inProgress: number;
    overdue: number;
  };
}

/* ================= MOCK DATA (replace with API call) ================= */

const mockData: UserDashboardData = {
  user: { name: "Alex Kim", avatar_initials: "AK", role: "Developer" },
  stats: {
    totalAssigned: 12,
    resolvedThisWeek: 5,
    inProgress: 4,
    overdue: 2,
  },
  assignedIssues: [
    {
      id: 1,
      title: "Fix authentication token expiry bug",
      priority: "critical",
      status: "in_progress",
      project_name: "Auth Service",
      due_date: "2025-03-22",
      created_at: "2025-03-18T09:00:00Z",
    },
    {
      id: 2,
      title: "Improve dashboard load time",
      priority: "high",
      status: "open",
      project_name: "Frontend",
      due_date: "2025-03-25",
      created_at: "2025-03-17T11:00:00Z",
    },
    {
      id: 3,
      title: "Update onboarding copy",
      priority: "low",
      status: "open",
      project_name: "Marketing Site",
      created_at: "2025-03-16T14:00:00Z",
    },
    {
      id: 4,
      title: "Add rate limiting to API endpoints",
      priority: "high",
      status: "in_progress",
      project_name: "Auth Service",
      due_date: "2025-03-24",
      created_at: "2025-03-15T08:00:00Z",
    },
    {
      id: 5,
      title: "Write unit tests for payment module",
      priority: "medium",
      status: "open",
      project_name: "Billing",
      created_at: "2025-03-14T10:00:00Z",
    },
  ],
  projects: [
    {
      id: 1,
      name: "Auth Service",
      role: "Lead",
      open_issues: 6,
      total_issues: 14,
      last_activity: "2025-03-20T15:00:00Z",
    },
    {
      id: 2,
      name: "Frontend",
      role: "Contributor",
      open_issues: 3,
      total_issues: 9,
      last_activity: "2025-03-19T11:00:00Z",
    },
    {
      id: 3,
      name: "Billing",
      role: "Contributor",
      open_issues: 2,
      total_issues: 7,
      last_activity: "2025-03-18T09:00:00Z",
    },
    {
      id: 4,
      name: "Marketing Site",
      role: "Reviewer",
      open_issues: 1,
      total_issues: 4,
      last_activity: "2025-03-17T14:00:00Z",
    },
  ],
};

/* ================= HELPERS ================= */

const priorityConfig = {
  critical: {
    label: "Critical",
    color: "var(--c-red)",
    bg: "var(--c-red-bg)",
    icon: <Flame size={12} />,
  },
  high: {
    label: "High",
    color: "var(--c-orange)",
    bg: "var(--c-orange-bg)",
    icon: <AlertCircle size={12} />,
  },
  medium: {
    label: "Medium",
    color: "var(--c-blue)",
    bg: "var(--c-blue-bg)",
    icon: <Clock size={12} />,
  },
  low: {
    label: "Low",
    color: "var(--c-muted)",
    bg: "var(--c-muted-bg)",
    icon: <Circle size={12} />,
  },
};

const statusConfig = {
  open: { label: "Open", color: "var(--c-muted)" },
  in_progress: { label: "In Progress", color: "var(--c-blue)" },
  resolved: { label: "Resolved", color: "var(--c-green)" },
};

const isOverdue = (due_date?: string) => {
  if (!due_date) return false;
  return new Date(due_date) < new Date();
};

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 36e5);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/* ================= COMPONENT ================= */

const UserDashboard = () => {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "in_progress" | "open">("all");

  useEffect(() => {
    // Replace with: const res = await getUserDashboard(); setData(res.data);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="ud-shell">
        <style>{styles}</style>
        <div className="ud-loading">
          <div className="ud-spinner" />
          <p>Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, stats, projects } = data;

  const filteredIssues =
    filter === "all"
      ? data.assignedIssues
      : data.assignedIssues.filter((i) => i.status === filter);

  const completionRate = Math.round(
    (stats.resolvedThisWeek / (stats.totalAssigned || 1)) * 100
  );

  const radialData = [
    { name: "Resolved", value: completionRate, fill: "var(--c-green-raw)" },
  ];

  return (
    <div className="ud-shell">
      <style>{styles}</style>

      {/* ── Header ── */}
      <header className="ud-header">
        <div className="ud-avatar">{user.avatar_initials}</div>
        <div>
          <h1 className="ud-greeting">Good morning, {user.name.split(" ")[0]}</h1>
          <p className="ud-role">{user.role}</p>
        </div>
      </header>

      {/* ── Stat strip ── */}
      <div className="ud-stats">
        <StatPill value={stats.totalAssigned} label="Assigned" accent="blue" />
        <StatPill value={stats.inProgress} label="In Progress" accent="orange" />
        <StatPill value={stats.resolvedThisWeek} label="Resolved / wk" accent="green" />
        <StatPill value={stats.overdue} label="Overdue" accent="red" />
      </div>

      {/* ── Main grid ── */}
      <div className="ud-grid">

        {/* ── Issues panel ── */}
        <section className="ud-card ud-issues">
          <div className="ud-card-header">
            <h2 className="ud-card-title">My Issues</h2>
            <div className="ud-filters">
              {(["all", "in_progress", "open"] as const).map((f) => (
                <button
                  key={f}
                  className={`ud-filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "in_progress" ? "In Progress" : "Open"}
                </button>
              ))}
            </div>
          </div>

          <ul className="ud-issue-list">
            {filteredIssues.map((issue) => {
              const p = priorityConfig[issue.priority];
              const s = statusConfig[issue.status];
              const overdue = isOverdue(issue.due_date);
              return (
                <li key={issue.id} className="ud-issue-row">
                  <div className="ud-issue-left">
                    <span
                      className="ud-priority-badge"
                      style={{ color: p.color, background: p.bg }}
                    >
                      {p.icon}
                      {p.label}
                    </span>
                    <div>
                      <p className="ud-issue-title">{issue.title}</p>
                      <p className="ud-issue-meta">
                        <FolderOpen size={11} />
                        {issue.project_name}
                        {issue.due_date && (
                          <span
                            className="ud-due"
                            style={{ color: overdue ? "var(--c-red)" : undefined }}
                          >
                            {overdue ? "⚠ " : ""}Due {new Date(issue.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="ud-issue-right">
                    <span className="ud-status" style={{ color: s.color }}>
                      {s.label}
                    </span>
                    <ChevronRight size={14} className="ud-chevron" />
                  </div>
                </li>
              );
            })}
            {filteredIssues.length === 0 && (
              <li className="ud-empty">
                <CheckCircle2 size={24} />
                <p>All clear here.</p>
              </li>
            )}
          </ul>
        </section>

        {/* ── Right column ── */}
        <div className="ud-right-col">

          {/* Completion ring */}
          <section className="ud-card ud-ring-card">
            <h2 className="ud-card-title">Weekly Progress</h2>
            <div className="ud-ring-wrap">
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="90%"
                  data={radialData}
                  startAngle={220}
                  endAngle={-40}
                >
                  <RadialBar background dataKey="value" cornerRadius={8} />
                  <Tooltip formatter={(v) => [`${v}%`, "Resolved"]} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="ud-ring-label">
                <span className="ud-ring-pct">{completionRate}%</span>
                <span className="ud-ring-sub">resolved</span>
              </div>
            </div>
            <p className="ud-ring-note">
              {stats.resolvedThisWeek} of {stats.totalAssigned} issues closed this week
            </p>
          </section>

          {/* Projects */}
          <section className="ud-card ud-projects">
            <div className="ud-card-header">
              <h2 className="ud-card-title">My Projects</h2>
            </div>
            <ul className="ud-project-list">
              {projects.map((proj) => {
                const pct = Math.round(
                  ((proj.total_issues - proj.open_issues) / (proj.total_issues || 1)) * 100
                );
                return (
                  <li key={proj.id} className="ud-project-row">
                    <div className="ud-project-top">
                      <div>
                        <p className="ud-project-name">{proj.name}</p>
                        <p className="ud-project-meta">
                          <span className="ud-role-badge">{proj.role}</span>
                          {proj.open_issues} open · {relativeTime(proj.last_activity)}
                        </p>
                      </div>
                      <BarChart2 size={15} className="ud-proj-icon" />
                    </div>
                    <div className="ud-progress-track">
                      <div
                        className="ud-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="ud-progress-label">{pct}% complete</p>
                  </li>
                );
              })}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

/* ================= SUB-COMPONENTS ================= */

const StatPill = ({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: "blue" | "orange" | "green" | "red";
}) => (
  <div className={`ud-stat-pill ud-stat-${accent}`}>
    <span className="ud-stat-val">{value}</span>
    <span className="ud-stat-lbl">{label}</span>
  </div>
);

/* ================= STYLES ================= */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .ud-shell {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    padding: 2rem;
    background: var(--bg);
    color: var(--text);

    --bg: #f5f4f0;
    --surface: #ffffff;
    --border: rgba(0,0,0,0.08);
    --text: #1a1a18;
    --text-2: #6b6b65;
    --text-3: #9c9c94;

    --c-blue: #1a62d6;
    --c-blue-bg: #e8f0fd;
    --c-blue-raw: #1a62d6;
    --c-orange: #c95b10;
    --c-orange-bg: #fdf0e7;
    --c-green: #1b8c5e;
    --c-green-bg: #e6f5ee;
    --c-green-raw: #1b8c5e;
    --c-red: #c23232;
    --c-red-bg: #fdeaea;
    --c-muted: #888882;
    --c-muted-bg: #f0efeb;
  }

  @media (prefers-color-scheme: dark) {
    .ud-shell {
      --bg: #141413;
      --surface: #1e1e1c;
      --border: rgba(255,255,255,0.08);
      --text: #f0efeb;
      --text-2: #a0a09a;
      --text-3: #6b6b65;

      --c-blue: #5a9aff;
      --c-blue-bg: #1a2540;
      --c-orange: #f5904a;
      --c-orange-bg: #2a1a0c;
      --c-green: #3ecf8e;
      --c-green-bg: #0e2318;
      --c-green-raw: #3ecf8e;
      --c-red: #f46a6a;
      --c-red-bg: #2a0f0f;
      --c-muted: #6b6b65;
      --c-muted-bg: #2a2a27;
    }
  }

  /* Loading */
  .ud-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 60vh; gap: 1rem;
    color: var(--text-2); font-size: 14px;
  }
  .ud-spinner {
    width: 28px; height: 28px;
    border: 2px solid var(--border);
    border-top-color: var(--c-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Header */
  .ud-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 2rem;
  }
  .ud-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--c-blue-bg); color: var(--c-blue);
    font-family: 'DM Mono', monospace;
    font-size: 14px; font-weight: 500;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ud-greeting {
    font-size: 22px; font-weight: 600; margin: 0;
    letter-spacing: -0.3px;
  }
  .ud-role {
    font-size: 13px; color: var(--text-2); margin: 2px 0 0;
  }

  /* Stat strip */
  .ud-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 1.5rem;
  }
  .ud-stat-pill {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ud-stat-val {
    font-size: 26px; font-weight: 600; line-height: 1;
    font-family: 'DM Mono', monospace;
  }
  .ud-stat-lbl {
    font-size: 12px; color: var(--text-2);
  }
  .ud-stat-blue .ud-stat-val  { color: var(--c-blue); }
  .ud-stat-orange .ud-stat-val { color: var(--c-orange); }
  .ud-stat-green .ud-stat-val  { color: var(--c-green); }
  .ud-stat-red .ud-stat-val    { color: var(--c-red); }

  /* Main grid */
  .ud-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .ud-grid { grid-template-columns: 1fr; }
    .ud-stats { grid-template-columns: repeat(2, 1fr); }
  }

  /* Cards */
  .ud-card {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: 14px;
    padding: 20px;
  }
  .ud-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .ud-card-title {
    font-size: 15px; font-weight: 600; margin: 0;
    letter-spacing: -0.1px;
  }

  /* Filters */
  .ud-filters { display: flex; gap: 4px; }
  .ud-filter-btn {
    font-size: 12px; padding: 4px 10px;
    border-radius: 6px; border: 0.5px solid var(--border);
    background: transparent; color: var(--text-2); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .ud-filter-btn:hover { background: var(--bg); }
  .ud-filter-btn.active {
    background: var(--c-blue-bg); color: var(--c-blue);
    border-color: transparent;
  }

  /* Issue list */
  .ud-issue-list { list-style: none; padding: 0; margin: 0; }
  .ud-issue-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0;
    border-bottom: 0.5px solid var(--border);
    gap: 12px;
    cursor: pointer;
    transition: background 0.1s;
    border-radius: 6px;
    margin: 0 -8px;
    padding-left: 8px; padding-right: 8px;
  }
  .ud-issue-row:last-child { border-bottom: none; }
  .ud-issue-row:hover { background: var(--bg); }
  .ud-issue-left { display: flex; align-items: flex-start; gap: 10px; min-width: 0; }
  .ud-priority-badge {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 500;
    padding: 3px 7px; border-radius: 5px;
    white-space: nowrap; flex-shrink: 0;
    margin-top: 1px;
  }
  .ud-issue-title {
    font-size: 14px; font-weight: 500; margin: 0 0 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 380px;
  }
  .ud-issue-meta {
    font-size: 12px; color: var(--text-2); margin: 0;
    display: flex; align-items: center; gap: 6px;
  }
  .ud-due { font-size: 11px; }
  .ud-issue-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .ud-status { font-size: 12px; font-weight: 500; }
  .ud-chevron { color: var(--text-3); }
  .ud-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 2.5rem 0; color: var(--text-3); gap: 8px;
    font-size: 14px;
  }

  /* Right column */
  .ud-right-col { display: flex; flex-direction: column; gap: 16px; }

  /* Ring card */
  .ud-ring-card {}
  .ud-ring-wrap { position: relative; }
  .ud-ring-label {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center; pointer-events: none;
  }
  .ud-ring-pct {
    display: block; font-size: 28px; font-weight: 600;
    font-family: 'DM Mono', monospace;
    color: var(--c-green);
  }
  .ud-ring-sub { font-size: 12px; color: var(--text-2); }
  .ud-ring-note {
    font-size: 12px; color: var(--text-2); text-align: center;
    margin: 4px 0 0;
  }

  /* Projects */
  .ud-project-list { list-style: none; padding: 0; margin: 0; }
  .ud-project-row { padding: 12px 0; border-bottom: 0.5px solid var(--border); }
  .ud-project-row:last-child { border-bottom: none; }
  .ud-project-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 8px;
  }
  .ud-project-name { font-size: 14px; font-weight: 500; margin: 0 0 3px; }
  .ud-project-meta {
    font-size: 12px; color: var(--text-2); margin: 0;
    display: flex; align-items: center; gap: 6px;
  }
  .ud-role-badge {
    font-size: 11px; padding: 2px 6px; border-radius: 4px;
    background: var(--c-muted-bg); color: var(--c-muted);
    font-weight: 500;
  }
  .ud-proj-icon { color: var(--text-3); margin-top: 2px; }
  .ud-progress-track {
    height: 4px; background: var(--border);
    border-radius: 99px; overflow: hidden; margin-bottom: 4px;
  }
  .ud-progress-fill {
    height: 100%; background: var(--c-green);
    border-radius: 99px;
    transition: width 0.6s ease;
  }
  .ud-progress-label { font-size: 11px; color: var(--text-3); margin: 0; }
`;