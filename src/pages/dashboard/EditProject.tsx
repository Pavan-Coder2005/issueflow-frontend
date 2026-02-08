import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "../../components/Modal";
import {
  getProjectById,
  updateProject,
} from "../../api/projects.api";

/* ================= TYPES ================= */

interface ProjectForm {
  name: string;
  key: string;
  description: string;
  status: string;
}

/* ================= COMPONENT ================= */

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null; // ✅ guard

  const projectId = Number(id); // ✅ convert once

  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    key: "",
    description: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getProjectById(projectId);

        setFormData({
          name: project.name,
          key: project.project_key,
          description: project.description ?? "",
          status: project.status ?? "active",
        });
      } catch (err) {
        alert("Failed to load project");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProject(projectId, {
        name: formData.name,
        key: formData.key,
        description: formData.description,
        status: formData.status,
      });

      navigate(-1);
    } catch {
      alert("Failed to update project");
    }
  };

  if (loading) {
    return <p className="text-gray-400">Loading project...</p>;
  }

  /* ================= UI ================= */

  return (
    <Modal title="Edit Project" onClose={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Project name"
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        />

        <input
          name="key"
          value={formData.key}
          onChange={handleChange}
          placeholder="Project key"
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProject;
