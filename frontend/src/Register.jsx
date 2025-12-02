import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // fixed capitalization

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/auth/register", // updated to match backend
        { username, email, password },
        { headers: { "Content-Type": "application/json" } } // ensure JSON
      );

      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/"); // fixed variable name
    } catch (err) {
      setError(err.response?.data?.message || "Server error"); // fixed err
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-10 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="User Name"
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 mt-2">
          Register
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link className="text-blue-600 hover:underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
