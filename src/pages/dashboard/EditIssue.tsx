import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { getIssueById, updateIssue } from "../../api/issues.api";

const EditIssue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null; // ✅ guard

  const issueId = Number(id); // ✅ convert once

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD ISSUE DATA
  ========================= */
  useEffect(() => {
    const loadIssue = async () => {
      try {
        const issue = await getIssueById(issueId);

        setFormData({
          title: issue.title,
          description: issue.description ?? "", // ✅ fix
          status: issue.status,
          priority: issue.priority,
        });
      } catch (err) {
        alert("Failed to load issue");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [issueId, navigate]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateIssue(issueId, formData); // ✅ number
      navigate(-1);
    } catch (err) {
      alert("Failed to update issue");
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading issue...</p>;
  }

  return (
    <Modal title="Edit Issue" onClose={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button className="bg-blue-600 px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIssue;
