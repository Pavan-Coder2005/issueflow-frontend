import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../../api/projects.api";

interface Project {
  id: number;
  name: string;
  status?: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjects();

        // ✅ FIX: unwrap projects array from response
        setProjects(res.projects ?? []);
      } catch (err) {
        console.error("Failed to load projects", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button
          onClick={() => navigate("/dashboard/projects/new")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          + Create Project
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() =>
                  navigate(`/dashboard/projects/${project.id}`)
                }
                className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer"
              >
                <td className="p-4">{project.name}</td>
                <td className="p-4 text-blue-400">
                  {project.status ?? "Active"}
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-gray-400 text-center">
                  No projects created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
