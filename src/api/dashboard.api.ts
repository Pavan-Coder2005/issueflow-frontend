const BASE_URL = "https://issueflow-backend-rxbo.onrender.com/api/dashboard";

/* =====================================
   GET DASHBOARD SUMMARY
===================================== */
export const getDashboardSummary = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load dashboard");
  }

  // 🔑 IMPORTANT:
  // Backend returns: { success, data }
  // Frontend reads: res.data.stats, res.data.recentActivity
  return res.json();
};


export const fetchDashboardCharts = async () => {
  const res = await fetch(`${BASE_URL}/charts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data.charts;
};
