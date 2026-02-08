import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS: Record<string, string> = {
  Open: "#dc2626",
  "In Progress": "#facc15",
  Resolved: "#16a34a",
};

const IssueStatusChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h3 className="font-semibold mb-4">Issue Status</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            outerRadius={90}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={COLORS[entry.status] || "#64748b"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueStatusChart;
