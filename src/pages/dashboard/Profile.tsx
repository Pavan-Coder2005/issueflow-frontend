import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../api/auth.api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMe();

        // 🔍 DEBUG: see exactly what backend sends
        console.log("FETCH ME RESPONSE 👉", data);

        setUser(data);
      } catch (err) {
        console.error("FETCH ME ERROR 👉", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  // 🔍 DEBUG: see what is stored in state
  console.log("USER STATE 👉", user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded max-w-md">
        <p>
          <strong>Name:</strong> {user?.name ?? "—"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email ?? "—"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
