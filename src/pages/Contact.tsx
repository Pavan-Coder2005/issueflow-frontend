import { CheckCircle, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
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
            <Link to="/about" className="text-gray-300 hover:text-white">
              About
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
      <section className="py-24 text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">
          Contact <span className="text-blue-500">Us</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Have a question, feedback, or need support? We’d love to hear from you.
        </p>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Get in Touch</h2>

            <p className="text-gray-400">
              Our team usually responds within one business day.
            </p>

            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="text-blue-500" />
              support@issueflow.dev
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <MessageSquare className="text-blue-500" />
              hello@issueflow.dev
            </div>
          </div>

          {/* Form */}
          <form className="bg-gray-900 border border-gray-800 p-8 rounded-xl space-y-5">
            <Input label="Full Name" placeholder="Your name" />
            <Input label="Email" placeholder="you@example.com" />
            <Input label="Subject" placeholder="How can we help?" />

            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500">
        © 2026 IssueFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;

/* ---------- Small Component ---------- */

const Input = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <div>
    <label className="block text-sm mb-2 text-gray-400">{label}</label>
    <input
      className="w-full bg-gray-950 border border-gray-800 rounded px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
      placeholder={placeholder}
    />
  </div>
);
