const BASE_URL = "http://localhost:3000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export interface Activity {
  id: number;
  action: string;
  actor_name: string;
  created_at: string;
  metadata?: any;
}

/* ================= PROJECT ACTIVITY ================= */
export const fetchProjectActivity = async (
  projectId: string
): Promise<Activity[]> => {
  const res = await fetch(
    `${BASE_URL}/activity/projects/${projectId}/activity`,
    { headers: authHeaders() }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data.activity;
};

/* ================= ISSUE ACTIVITY ================= */
export const fetchIssueActivity = async (
  issueId: string
): Promise<Activity[]> => {
  const res = await fetch(
    `${BASE_URL}/activity/issues/${issueId}/activity`,
    { headers: authHeaders() }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data.activity;
};
