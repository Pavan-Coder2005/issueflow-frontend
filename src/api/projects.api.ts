const BASE_URL = "http://localhost:3000/api/projects";

/* =====================================
   AUTH HEADER (SAFE)
===================================== */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* =====================================
   TYPES
===================================== */
export interface Project {
  id: number;
  name: string;
  project_key: string;
  description?: string;
  status?: string;
}

export interface ProjectPayload {
  name: string;
  key: string;
  description?: string;
  status?: string;
}

/* =====================================
   CREATE PROJECT
===================================== */
export const createProject = async (data: ProjectPayload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create project");
  }

  return result; // full response
};

/* =====================================
   GET ALL PROJECTS
===================================== */
export const fetchProjects = async () => {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch projects");
  }

  return result; // full response
};

/* =====================================
   GET PROJECT BY ID
===================================== */
export const getProjectById = async (id: number): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch project");
  }

  return result.data.project;
};

/* =====================================
   UPDATE PROJECT
===================================== */
export const updateProject = async (
  id: number,
  data: ProjectPayload
) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update project");
  }

  return result;
};

/* =====================================
   DELETE PROJECT
===================================== */
export const deleteProject = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete project");
  }

  return result;
};
