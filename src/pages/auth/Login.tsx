import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setApiError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password)
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store JWT
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-gray-950 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" />
            <span className="text-xl font-bold">IssueFlow</span>
          </div>

          <div className="space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-28 flex justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-6">
            Sign in to continue to IssueFlow
          </p>

          {apiError && <ErrorText text={apiError} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <InputField
              label="Email"
              name="email"
              type="email"
              icon={<Mail />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@company.com"
            />

            {/* Password */}
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              show={showPassword}
              setShow={setShowPassword}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* ---------- Reusable Components ---------- */

const InputField = ({
  label,
  name,
  type,
  icon,
  value,
  onChange,
  error,
  placeholder,
}: any) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 rounded bg-gray-950 border ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      />
    </div>
    {error && <ErrorText text={error} />}
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  show,
  setShow,
  onChange,
  error,
}: any) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-10 py-2 rounded bg-gray-950 border ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <ErrorText text={error} />}
  </div>
);

const ErrorText = ({ text }: { text: string }) => (
  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
    <AlertCircle size={14} />
    {text}
  </p>
);
