const BASE_URL = "http://localhost:3000/api/invites";

export const acceptInvite = async (token: string) => {
  const authToken = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to accept invite");
  }

  return data;
};
