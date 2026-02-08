import {
  CheckCircle,
  Shield,
  GitBranch,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ---------- Types ---------- */
type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

type StatProps = {
  value: string;
  label: string;
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" />
            <span className="text-xl font-bold">IssueFlow</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link>

            <Link to="/contact" className="text-gray-300 hover:text-white transition">
              Contact
            </Link>

            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-28 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Issue Tracking,{" "}
          <span className="text-blue-500">Simplified</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          Manage projects, track issues, and collaborate with your team using a
          modern SaaS issue tracking platform.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-lg transition"
          >
            Start Free Trial
          </Link>

          <Link
            to="/dashboard"
            className="border border-gray-700 px-6 py-3 rounded text-lg hover:bg-gray-900 transition"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<GitBranch />}
              title="Project Management"
              text="Organize projects with workflows, sprints, and issue tracking."
            />
            <Feature
              icon={<Users />}
              title="Team Collaboration"
              text="Assign issues, comment in real-time, and track progress."
            />
            <Feature
              icon={<Shield />}
              title="Role Based Access"
              text="Secure access with roles and permissions."
            />
            <Feature
              icon={<BarChart3 />}
              title="Analytics"
              text="Track productivity with dashboards and reports."
            />
            <Feature
              icon={<CheckCircle />}
              title="Issue Lifecycle"
              text="Track issues from creation to completion."
            />
            <Feature
              icon={<Users />}
              title="Multi-Organization"
              text="Manage multiple teams and organizations."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Stat value="99.9%" label="Uptime" />
          <Stat value="500ms" label="Avg Response" />
          <Stat value="SOC 2" label="Compliant" />
          <Stat value="24/7" label="Support" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
          <p>© 2026 IssueFlow. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

/* ---------- Small Components ---------- */

const Feature = ({ icon, title, text }: FeatureProps) => (
  <div className="bg-gray-950 border border-gray-800 p-6 rounded-lg hover:border-blue-600 transition">
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{text}</p>
  </div>
);

const Stat = ({ value, label }: StatProps) => (
  <div>
    <p className="text-3xl font-bold text-blue-500">{value}</p>
    <p className="text-gray-400 mt-1">{label}</p>
  </div>
);