import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { admin, logout } = authContext;

  const baseStyles = "block py-2 px-6 font-medium text-lg transition duration-200";
  const activeStyles = "bg-teal-600 !text-white";
  const inactiveStyles = "!text-gray-100 hover:bg-teal-600 hover:text-cyan-200";

  const onLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        logout();
      }
  }

  return (
    <aside className="w-72 bg-teal-700 text-white h-screen fixed top-0 left-0 shadow-lg">
      <div className="p-4 border-b border-teal-600 flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          Garuda Flights Admin
        </h1>
      </div>

      <ul className="mt-4 space-y-2">
        {!admin ? (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Sign Up
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/aircraft"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Aircrafts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/routes"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Routes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/flights"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Flights
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <button
                onClick={ () => onLogout()}
                className={`${baseStyles} w-full text-left !bg-red-400 hover:!bg-red-500`}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;