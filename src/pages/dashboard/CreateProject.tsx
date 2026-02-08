import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../api/projects.api";

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await createProject(formData);

      // ✅ Redirect after successful creation
      navigate("/dashboard/projects");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Project</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {error && (
          <p className="text-red-400 bg-red-900/20 p-2 rounded">{error}</p>
        )}

        <input
          name="name"
          placeholder="Project Name"
          required
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <input
          name="key"
          placeholder="Project Key (e.g. IFLOW)"
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

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
