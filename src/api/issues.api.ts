const BASE_URL = "https://issueflow-backend-rxbo.onrender.com/api/issues";

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
  assignee_id?: number | null;
  assignee_name?: string | null; // ✅ ADD THIS
  created_at: string;            // backend always sends this
  resolved_at?: string | null;
}

export interface CreateIssuePayload {
  project_id: number;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  assignee_id?: number | null;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignee_id?: number | null;
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
   FETCH ISSUE BY ID
============================ */

export const getIssueById = async (id: number): Promise<Issue> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch issue");
  }

  const data = await res.json();
  return data.issue;
};

/* ============================
   UPDATE ISSUE
============================ */

export const updateIssue = async (
  id: number,
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

export const deleteIssue = async (id: number) => {
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
  projectId: number
): Promise<Issue[]> => {
  const res = await fetch(
    `${BASE_URL}/projects/${projectId}/issues`,
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
