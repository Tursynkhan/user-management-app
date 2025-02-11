import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          User Management
        </Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-400">Login</Link>
              <Link to="/register" className="hover:text-gray-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
