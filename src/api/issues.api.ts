const BASE_URL = "http://localhost:3000/api/issues";

/* ============================
   TYPES / INTERFACES
============================ */

export interface Issue {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  created_at?: string;
  resolved_at?: string | null;
}

export interface CreateIssuePayload {
  project_id: number;
  title: string;
  description?: string;
  priority: string;
}

export interface UpdateIssuePayload {
  title: string;
  description?: string;
  priority: string;
  status: string;
}

/* ============================
   HELPER: AUTH HEADER
============================ */

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ============================
   CREATE ISSUE
============================ */

export const createIssue = async (
  data: CreateIssuePayload
): Promise<Issue> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create issue");
  }

  return result.issue;
};

/* ============================
   FETCH ALL ISSUES
============================ */

export const fetchIssues = async (): Promise<Issue[]> => {
  const res = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch issues");
  }

  return result.issues ?? [];
};

/* ============================
   FETCH ISSUE BY ID ✅ FIXED
============================ */

export const getIssueById = async (id: string): Promise<Issue> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch issue");
  }

  const data = await res.json();

  // backend returns { success, issue }
  return data.issue;
};

/* ============================
   UPDATE ISSUE
============================ */

export const updateIssue = async (
  id: string,
  data: UpdateIssuePayload
): Promise<Issue> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update issue");
  }

  return result.issue;
};

/* ============================
   DELETE ISSUE
============================ */

export const deleteIssue = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete issue");
  }

  return result;
};

/* ============================
   FETCH ISSUES BY PROJECT
============================ */

export const fetchIssuesByProject = async (
  projectId: string | number
): Promise<Issue[]> => {
  const res = await fetch(
    `http://localhost:3000/api/projects/${projectId}/issues`,
    {
      headers: authHeaders(),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch project issues");
  }

  return result.issues ?? [];
};
