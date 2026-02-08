import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchIssues,Issue } from "../../api/issues.api";

const Issues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        console.error("Failed to load issues", err);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading issues...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Issues</h1>

        <Link
          to="/dashboard/issues/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          + Create Issue
        </Link>
      </div>

      {/* Issues Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className="border-t border-gray-800 hover:bg-gray-800"
              >
                <td className="p-4">#{issue.id}</td>

                <td
                  className="p-4 text-blue-400 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/dashboard/issues/${issue.id}`)
                  }
                >
                  {issue.title}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      issue.status === "Open"
                        ? "bg-red-600/20 text-red-400"
                        : issue.status === "In Progress"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "bg-green-600/20 text-green-400"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`${
                      issue.priority === "High"
                        ? "text-red-400"
                        : issue.priority === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {issue.priority}
                  </span>
                </td>

                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/issues/${issue.id}`)
                    }
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/dashboard/issues/${issue.id}/edit`)
                    }
                    className="text-yellow-400 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}

            {issues.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-gray-400 text-center">
                  No issues created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Issues;
