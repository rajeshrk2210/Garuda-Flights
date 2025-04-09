import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext);
    if (!authContext) return null;
    const { admin, logout } = authContext;


    return (
        <aside className="w-64 bg-teal-700 text-white h-screen fixed top-0 left-0 shadow-lg">
            <div className="p-4 border-b border-teal-600 flex justify-between items-center">
                <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>Garuda Flights Admin</h1>
            </div>

            <ul className="mt-4 space-y-2">
                {!admin ? (
                    <>
                        <li>
                            <Link
                                to="/login"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/signup"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link
                                to="/dashboard"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/aircraft"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Aircrafts
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/routes"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Routes
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/flights"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Flights
                            </Link>
                        </li>
                        
                        <li>
                            <Link
                                to="/profile"
                                className="block py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
                            >
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="block w-full text-left py-2 px-6 !text-gray-100 hover:bg-teal-600 hover:text-cyan-200 font-medium text-lg transition duration-200"
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