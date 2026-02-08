import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AcceptInvite from "./pages/AcceptInvite";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/dashboard/Projects";
import ProjectDetails from "./pages/dashboard/ProjectDetails";
import CreateProject from "./pages/dashboard/CreateProject";
import EditProject from "./pages/dashboard/EditProject";

import Issues from "./pages/dashboard/Issues";
import CreateIssue from "./pages/dashboard/CreateIssue";
import IssueDetails from "./pages/dashboard/IssueDetails";
import EditIssue from "./pages/dashboard/EditIssue";

import Profile from "./pages/dashboard/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ===== Protected Dashboard ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Projects */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:id/edit" element={<EditProject />} />

          {/* Issues */}
          <Route path="issues" element={<Issues />} />
          <Route path="issues/new" element={<CreateIssue />} />
          <Route path="issues/:id" element={<IssueDetails />} />
          <Route path="issues/:id/edit" element={<EditIssue />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
