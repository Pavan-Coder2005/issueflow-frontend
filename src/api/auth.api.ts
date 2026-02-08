const BASE_URL = "http://localhost:3000/api/auth";

/* ================================
   AUTH HEADERS
================================ */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/* ================================
   TYPES
================================ */
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

/* ================================
   GET CURRENT USER
================================ */
export const fetchMe = async (): Promise<User> => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: getAuthHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Unauthorized");
  }

  return result.user;
};

/* ================================
   FORGOT PASSWORD
================================ */
export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to send reset link");
  }

  return result;
};

/* ================================
   RESET PASSWORD
================================ */
export const resetPassword = async (
  token: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Password reset failed");
  }

  return result;
};
