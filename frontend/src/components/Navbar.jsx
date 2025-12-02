import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    Navigate("/login");
  };
  return (
    <nav className="bg-gray-900 p-4 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">Notes App</Link>
        {user && (
          <>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md 
              hover:bg-red-700 "
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
