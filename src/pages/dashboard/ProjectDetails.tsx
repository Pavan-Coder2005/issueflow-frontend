import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getProjectById, deleteProject } from "../../api/projects.api";
import { fetchIssuesByProject } from "../../api/issues.api";
import type { Issue } from "../../api/issues.api";
import {
  fetchProjectMembers,
  inviteUser as inviteUserToProject,
  updateMemberRole,
  removeMember,
} from "../../api/members.api";

import Modal from "../../components/Modal";

/* ================= TYPES ================= */

interface Project {
  id: number;
  name: string;
  project_key: string;
  description?: string;
  status?: string;
}

interface Member {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

/* ================= COMPONENT ================= */

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null; // ✅ guard

  const projectId = Number(id); // ✅ convert once

  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= INVITE ================= */
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  /* ================= MEMBER SEARCH ================= */
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  /* ================= DATA LOAD ================= */
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [projectData, issuesData, membersData] = await Promise.all([
          getProjectById(projectId),
          fetchIssuesByProject(projectId),
          fetchProjectMembers(projectId),
        ]);

        if (mounted) {
          setProject(projectData);
          setIssues(issuesData);
          setMembers(membersData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load project details");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  /* ================= DELETE PROJECT ================= */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await deleteProject(projectId);
      alert(res?.message || "Project deleted successfully");
      navigate("/dashboard/projects");
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  /* ================= INVITE ================= */
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      alert("Email required");
      return;
    }

    try {
      await inviteUserToProject(projectId, inviteEmail);
      alert("Invite sent");
      setInviteEmail("");
      setShowInvite(false);
      setMembers(await fetchProjectMembers(projectId));
    } catch (err: any) {
      alert(err.message || "Invite failed");
    }
  };

  /* ================= ROLE CHANGE ================= */
  const handleRoleChange = async (
    userId: number,
    role: "admin" | "member"
  ) => {
    try {
      await updateMemberRole(projectId, userId, role);
      setMembers(await fetchProjectMembers(projectId));
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    }
  };

  /* ================= REMOVE MEMBER ================= */
  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Remove member?")) return;

    try {
      await removeMember(projectId, userId);
      setMembers(await fetchProjectMembers(projectId));
    } catch (err: any) {
      alert(err.message || "Failed to remove member");
    }
  };

  /* ================= STATES ================= */
  if (loading) return <p className="text-gray-400">Loading project...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!project) return <p className="text-gray-400">Project not found</p>;

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/dashboard/projects/${projectId}/edit`)}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => setShowInvite(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Invite User
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ================= PROJECT INFO ================= */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-2">
        <p>
          <span className="text-gray-400">Project ID:</span> {project.id}
        </p>
        <p>
          <span className="text-gray-400">Key:</span> {project.project_key}
        </p>
        <p>
          <span className="text-gray-400">Status:</span>{" "}
          <span className="text-green-400">{project.status}</span>
        </p>
        <p className="text-gray-400 pt-2">{project.description}</p>
      </div>

      {/* ================= MEMBERS ================= */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded text-sm"
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((m) => (
              <tr
                key={m.user_id}
                className="border-t border-gray-800 hover:bg-gray-800"
              >
                <td className="p-3">{m.name}</td>
                <td className="p-3 text-gray-400">{m.email}</td>
                <td className="p-3">{m.role}</td>
                <td className="p-3 flex gap-2">
                  <select
                    value={m.role}
                    onChange={(e) =>
                      handleRoleChange(
                        m.user_id,
                        e.target.value as "admin" | "member"
                      )
                    }
                    className="bg-gray-800 px-2 py-1 rounded text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>

                  <button
                    onClick={() => handleRemoveMember(m.user_id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ISSUES ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Issues</h2>
        <Link
          to={`/dashboard/issues/new?projectId=${project.id}`}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          + Create Issue
        </Link>
      </div>

      {/* ================= ISSUES LIST ================= */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {issues.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No issues yet</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => navigate(`/dashboard/issues/${issue.id}`)}
                  className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer"
                >
                  <td className="p-3">{issue.title}</td>
                  <td className="p-3 capitalize">{issue.status}</td>
                  <td className="p-3">{issue.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= INVITE MODAL ================= */}
      {showInvite && (
        <Modal title="Invite User" onClose={() => setShowInvite(false)}>
          <input
            type="email"
            placeholder="user@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowInvite(false)}
              className="bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Send Invite
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetails;
