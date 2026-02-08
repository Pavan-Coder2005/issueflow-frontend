import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Modal from "../../components/Modal";
import { getIssueById, deleteIssue, updateIssue } from "../../api/issues.api";
import { fetchIssueActivity } from "../../api/activity.api";
import { fetchProjectMembers } from "../../api/members.api";

/* ================= TYPES ================= */

interface Issue {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: number | null;
  assignee_name?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

interface Activity {
  id: number;
  action: string;
  actor_name: string;
  created_at: string;
  metadata?: any; // 🔥 IMPORTANT
}

interface Member {
  user_id: number;
  name: string;
  email: string;
}

/* ================= COMPONENT ================= */

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /* ================= AUTH ================= */
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isAdmin = user?.role === "admin";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const issueData = await getIssueById(id);
        const activityData = await fetchIssueActivity(id);

        setIssue(issueData);
        setActivity(activityData);

        if (isAdmin) {
          const membersData = await fetchProjectMembers(issueData.project_id);
          setMembers(membersData);
        }
      } catch (err) {
        console.error("ISSUE DETAILS LOAD ERROR:", err);
        alert("Failed to load issue");
        navigate("/dashboard/issues");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate, isAdmin]);

  /* ================= UPDATE ISSUE ================= */
  const update = async (payload: Partial<Issue>) => {
    if (!issue) return;

    try {
      setSaving(true);

      const updated = await updateIssue(issue.id.toString(), {
        title: issue.title,
        description: issue.description || "",
        priority: issue.priority,
        status: payload.status ?? issue.status,
        assignee_id: payload.assignee_id ?? issue.assignee_id,
      });

      setIssue(updated);

      const activityData = await fetchIssueActivity(issue.id.toString());
      setActivity(activityData);
    } catch {
      alert("Failed to update issue");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteIssue(id);
      navigate("/dashboard/issues");
    } catch {
      alert("Failed to delete issue");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p className="text-gray-400">Loading issue...</p>;
  if (!issue) return <p className="text-gray-400">Issue not found</p>;

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{issue.title}</h1>

        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/dashboard/issues/${id}/edit`)}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => setShowDelete(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* META */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4">
        {/* STATUS */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Status:</span>
          <select
            value={issue.status}
            disabled={saving}
            onChange={(e) => update({ status: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* ASSIGNEE */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Assignee:</span>

          {isAdmin ? (
            <select
              value={issue.assignee_id ?? ""}
              disabled={saving}
              onChange={(e) =>
                update({
                  assignee_id: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-gray-300 text-sm">
              {issue.assignee_name || "Unassigned"}
            </span>
          )}
        </div>

        <p>
          <span className="text-gray-400">Priority:</span>{" "}
          <PriorityBadge priority={issue.priority} />
        </p>

        <p className="text-gray-400">
          Created: {new Date(issue.created_at).toLocaleString()}
        </p>

        {issue.resolved_at && (
          <p className="text-green-400">
            Resolved: {new Date(issue.resolved_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-400 whitespace-pre-line">
          {issue.description || "No description provided"}
        </p>
      </div>

      {/* ACTIVITY */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Activity</h2>

        {activity.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet</p>
        ) : (
          <ul className="space-y-3 text-gray-400">
            {activity.map((a) => (
              <li key={a.id} className="text-sm">
                <span className="font-semibold text-gray-200">
                  {a.actor_name}
                </span>{" "}
                {formatAction(a)}
                <span className="text-gray-500">
                  {" "}
                  · {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <Modal title="Delete Issue" onClose={() => setShowDelete(false)}>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete this issue?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDelete(false)}
              className="px-4 py-2 rounded bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IssueDetails;

/* ================= HELPERS ================= */

const formatAction = (a: Activity) => {
  switch (a.action) {
    case "ISSUE_CREATED":
      return `created "${a.metadata?.issueTitle ?? "an issue"}"`;

    case "ISSUE_RESOLVED":
      return `resolved "${a.metadata?.issueTitle ?? "this issue"}"`;

    case "ISSUE_ASSIGNED":
      return `assigned "${
        a.metadata?.issueTitle ?? "this issue"
      }" to ${a.metadata?.assigneeName ?? "someone"}`;

    default:
      return a.action.toLowerCase().replace(/_/g, " ");
  }
};


const PriorityBadge = ({ priority }: { priority: string }) => {
  const color =
    priority === "High"
      ? "bg-red-600"
      : priority === "Medium"
      ? "bg-yellow-600"
      : "bg-blue-600";

  return (
    <span className={`px-3 py-1 rounded text-sm ${color}`}>
      {priority}
    </span>
  );
};
