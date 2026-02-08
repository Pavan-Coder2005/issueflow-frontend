import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { getProjectById, updateProject } from "../../api/projects.api";

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH PROJECT ================= */
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const project = await getProjectById(id); // ✅ project directly

        setFormData({
          name: project.name,
          key: project.project_key, // ✅ backend field
          description: project.description || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProject(id!, {
        name: formData.name,
        key: formData.key,
        description: formData.description,
      });

      navigate(-1); // close modal
    } catch (err: any) {
      alert(err.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <Modal title="Edit Project" onClose={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="text-sm text-gray-400">Project Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
            required
          />
        </div>

        {/* KEY */}
        <div>
          <label className="text-sm text-gray-400">Project Key</label>
          <input
            name="key"
            value={formData.key}
            onChange={handleChange}
            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProject;
