import { useEffect, useState } from "react";
import { Bug, CheckCircle, Folder } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// 👉 create new API for user
import { getUserDashboard } from "../../api/dashboard.api";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myProjects: 0,
    assignedIssues: 0,
    resolvedIssues: 0,
  });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getUserDashboard(); // 🔥 new API
        setStats(res.data.stats);
        setActivity(res.data.recentActivity);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  const data = [
    { name: "Assigned", value: stats.assignedIssues },
    { name: "Resolved", value: stats.resolvedIssues },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* ✅ USER STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card icon={<Folder />} label="My Projects" value={stats.myProjects} />
        <Card icon={<Bug />} label="Assigned Issues" value={stats.assignedIssues} />
        <Card icon={<CheckCircle />} label="Resolved Issues" value={stats.resolvedIssues} />
      </div>

      {/* ✅ CHART */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">My Issue Status</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ ACTIVITY */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">My Activity</h2>

        {activity.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity</p>
        ) : (
          <ul className="space-y-3 text-gray-400">
            {activity.map((a) => (
              <li key={a.id}>
                {a.message} ·{" "}
                <span className="text-gray-500">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

/* ✅ SMALL COMPONENT */
const Card = ({ icon, label, value }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className="text-blue-500">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);