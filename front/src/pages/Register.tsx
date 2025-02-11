import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name: string) => /^[a-zA-Zа-яА-Я\s]{2,}$/.test(name); 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validateName(name)) {
      setError("Name must contain only letters and be at least 2 characters long.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      navigate("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as { response: { data?: { message?: string } } };
        setError(axiosError.response.data?.message || "Registration failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen max-w-[800px] mx-auto flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-5 border border-gray-500 rounded p-5">
        <h2>Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col justify-center item-center gap-2">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-500 rounded p-2 text-sm" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-500 rounded p-2 text-sm" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-500 rounded p-2 text-sm" />
          <button type="submit" className="text-sm bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-sm">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
