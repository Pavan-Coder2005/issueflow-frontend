import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
} from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors({});
    setApiError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.organization.trim())
      newErrors.organization = "Organization name is required";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters required";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          organization: formData.organization,
          password: formData.password,
        }
      );

      // Store JWT token
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Registration failed"
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
          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-400 mb-6">
            Start tracking issues with IssueFlow
          </p>

          {apiError && (
            <ErrorText text={apiError} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Full Name" name="fullName" icon={<User />} value={formData.fullName} onChange={handleChange} error={errors.fullName} />
            <InputField label="Email" name="email" icon={<Mail />} value={formData.email} onChange={handleChange} error={errors.email} />
            <InputField label="Organization" name="organization" icon={<Building2 />} value={formData.organization} onChange={handleChange} error={errors.organization} />

            <PasswordField label="Password" name="password" value={formData.password} show={showPassword} setShow={setShowPassword} onChange={handleChange} error={errors.password} />
            <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            <label className="flex gap-2 text-sm text-gray-400">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
              I agree to the Terms & Privacy Policy
            </label>
            {errors.agreeToTerms && <ErrorText text={errors.agreeToTerms} />}

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

/* ---------- Reusable Components ---------- */

const InputField = ({ label, name, icon, value, onChange, error }: any) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 py-2 rounded bg-gray-950 border ${
          error ? "border-red-500" : "border-gray-700"
        }`}
      />
    </div>
    {error && <ErrorText text={error} />}
  </div>
);

const PasswordField = ({ label, name, value, show, setShow, onChange, error }: any) => (
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
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
