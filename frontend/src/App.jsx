import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false); // No token, stop loading
          return;
        }

        // Verify token with backend
        const { data } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data); // set user in state
        localStorage.setItem("user", JSON.stringify(data)); // persist
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false); // done fetching
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    // Show spinner while checking auth
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading....</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
