import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  User,
} from "lucide-react";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800";

  const activeClass = "bg-gray-800 text-blue-400";
  console.log("SIDEBAR MOUNTED");


  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-8 text-white">IssueFlow</h2>

      <nav className="space-y-2 text-gray-300">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Home
        </NavLink>

        <NavLink
          to="/dashboard/projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FolderKanban size={18} />
          Projects
        </NavLink>

        <NavLink
          to="/dashboard/issues"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Bug size={18} />
          Issues
        </NavLink>

        <div className="pt-6 border-t border-gray-800">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <User size={18} />
            Profile
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
