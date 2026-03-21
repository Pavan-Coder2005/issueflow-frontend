import { useEffect, useState } from "react";
import { BarChart3, Bug, FolderKanban, Users } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardSummary } from "../../api/dashboard.api";
import { formatActivity } from "../../utils/activityFormatter";

/* ================= TYPES ================= */

interface DashboardStats {
  projects: number;
  openIssues: number;
  teamMembers: number;
  resolvedThisWeek: number;
}

interface Activity {
  id: number;
  action: string;
  actor_name: string;
  metadata?: {
    issueTitle?: string;
    assigneeName?: string;
    name?: string; // project name
    userId?: number;
    role?: string;
    oldRole?: string;
    newRole?: string;
    memberName?: string;
    projectName?: string;
  };
  created_at: string;
}

/* ================= COMPONENT ================= */

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    openIssues: 0,
    teamMembers: 0,
    resolvedThisWeek: 0,
  });
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboardSummary();
        setStats(res.data.stats);
        setActivity(res.data.recentActivity);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  /* ================= CHART DATA ================= */

  const issueStatusData = [
    { name: "Open", value: stats.openIssues },
    { name: "Resolved", value: stats.resolvedThisWeek },
  ];

  const weeklyIssuesData = [
    { day: "Mon", issues: 2 },
    { day: "Tue", issues: 4 },
    { day: "Wed", issues: 3 },
    { day: "Thu", issues: 5 },
    { day: "Fri", issues: 1 },
    { day: "Sat", issues: 0 },
    { day: "Sun", issues: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<FolderKanban />} label="Projects" value={stats.projects} />
        <StatCard icon={<Bug />} label="Open Issues" value={stats.openIssues} />
        <StatCard icon={<Users />} label="Team Members" value={stats.teamMembers} />
        <StatCard
          icon={<BarChart3 />}
          label="Resolved This Week"
          value={stats.resolvedThisWeek}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Issue Status Pie */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Issue Status</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Issues Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Issues This Week</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyIssuesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        {activity.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          <ul className="space-y-3 text-gray-400">
            {activity.map((a) => (
              <li key={a.id} className="text-sm">
                <span className="font-semibold text-gray-200">
                  {a.actor_name}
                </span>{" "}
                {formatActivity(a)}
                <span className="text-gray-500">
                  {" "}· {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= COMPONENTS ================= */

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className="text-blue-500">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
