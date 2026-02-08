import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../api/auth.api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token!, password);
      setMessage(res.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {message && (
          <p className="mb-4 text-sm text-green-400">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <input
            type="password"
            placeholder="Confirm password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
