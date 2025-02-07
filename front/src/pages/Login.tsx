/// <reference types="vite/client" />
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ token: string }>(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Network error, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-[800px] min-w-[600px] mx-auto flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 rounded p-5">
        <h2>Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col justify-center item-center gap-2">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-500 rounded p-2 text-sm" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-500 rounded p-2 text-sm" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-sm">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
