const BASE_URL = "http://localhost:3000/api/projects";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ================= FETCH MEMBERS ================= */
export const fetchProjectMembers = async (projectId: string) => {
  const res = await fetch(`${BASE_URL}/${projectId}/members`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data.members;
};

/* ================= INVITE USER ================= */
export const inviteUser = async (
  projectId: string,
  email: string,
  role: "member" | "admin" = "member"
) => {
  const res = await fetch(
    `http://localhost:3000/api/invites/projects/${projectId}/invite`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, role }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

/* ================= UPDATE ROLE ================= */
export const updateMemberRole = async (
  projectId: string,
  userId: number,
  role: "admin" | "member"
) => {
  const res = await fetch(
    `${BASE_URL}/${projectId}/members/${userId}/role`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update role");

  return data;
};

/* ================= REMOVE MEMBER ================= */
export const removeMember = async (
  projectId: string,
  userId: number
) => {
  const res = await fetch(
    `${BASE_URL}/${projectId}/members/${userId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove member");

  return data;
};
