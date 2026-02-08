import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createIssue } from "../../api/issues.api";

const CreateIssue = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const projectId = searchParams.get("projectId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      alert("Project not found. Please create issue from a project.");
      return;
    }

    try {
      setLoading(true);

      console.log("Creating issue for project:", projectId); // 🧪 debug

      await createIssue({
        project_id: Number(projectId), // ✅ FIXED
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
      });

      navigate(`/dashboard/projects/${projectId}`);
    } catch (err: any) {
      alert(err.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Issue</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          name="title"
          placeholder="Issue title"
          required
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <select
          name="priority"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          onChange={handleChange}
          defaultValue="Medium"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          name="status"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          onChange={handleChange}
          defaultValue="Open"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
};

export default CreateIssue;
