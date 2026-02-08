import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IssueTimelineChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h3 className="font-semibold mb-4">Issues Last 7 Days</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="created" fill="#3b82f6" />
          <Bar dataKey="resolved" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueTimelineChart;
