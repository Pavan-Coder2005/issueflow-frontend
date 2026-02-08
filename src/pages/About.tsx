import { CheckCircle, Shield, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" />
            <span className="text-xl font-bold">IssueFlow</span>
          </div>

          <nav className="space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white">
              Contact
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          About <span className="text-blue-500">IssueFlow</span>
        </h1>

        <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
          IssueFlow is a modern issue tracking platform built to help teams
          collaborate better, move faster, and stay organized. We focus on
          clarity, performance, and real-world workflows—without unnecessary
          complexity.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-400 text-lg">
            To make issue tracking simple, transparent, and scalable—so teams
            can focus on building great products instead of fighting tools.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            What We Believe In
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <Value
              icon={<Users />}
              title="Collaboration"
              text="Teams work best when communication is clear and visible."
            />
            <Value
              icon={<Shield />}
              title="Security"
              text="Role-based access and audit trails you can trust."
            />
            <Value
              icon={<BarChart3 />}
              title="Insights"
              text="Data-driven decisions through activity logs and analytics."
            />
            <Value
              icon={<CheckCircle />}
              title="Simplicity"
              text="Powerful features without unnecessary complexity."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to try IssueFlow?
        </h2>
        <Link
          to="/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded text-lg transition"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500">
        © 2026 IssueFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default About;

/* ---------- Small Component ---------- */

const Value = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="bg-gray-950 border border-gray-800 p-6 rounded-lg text-center">
    <div className="text-blue-500 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{text}</p>
  </div>
);
