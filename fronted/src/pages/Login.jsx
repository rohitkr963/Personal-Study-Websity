import React, { useState } from "react";
import AnimatedModel from "../components/AnimatedModel";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../utils/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res && res.token) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left: Form */}
          <div className="bg-transparent">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Welcome Back!!</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
              {error && <div className="text-red-600">{error}</div>}

              <div>
                <label className="text-sm text-slate-700 mb-2 block">Email</label>
                <div className="flex items-center border rounded-full bg-white px-4 py-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@gmail.com"
                    className="w-full outline-none text-slate-700"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-slate-700">Password</label>
                  <Link to="/forgot" className="text-xs text-slate-500">Forgot Password?</Link>
                </div>
                <div className="flex items-center border rounded-full bg-white px-4 py-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c2 0 4 1 4 3v3H8v-3c0-2 2-3 4-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 11V7a6 6 0 1112 0v4" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full outline-none text-slate-700"
                  />
                </div>
              </div>

              <div>
                <button disabled={loading} type="submit" className="w-48 h-12 rounded-full bg-amber-300 text-slate-800 font-semibold shadow-md">
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <div className="text-sm text-slate-500">- or -</div>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

                <div className="flex items-center gap-4">
              
              </div>

              <div className="text-sm text-slate-600 mt-2">
                Don't have an account? <Link to="/signup" className="text-amber-700 font-semibold">Sign up</Link>
              </div>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="w-72 h-72 bg-amber-100 rounded-full flex items-center justify-center">
              {/* Animated 3D model component */}
              <div className="w-64 h-64">
                {/* lazy-loaded model viewer */}
                <React.Suspense fallback={<div className="w-full h-full bg-white rounded-3xl shadow-md flex items-center justify-center">Loading...</div>}>
                  <AnimatedModel />
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
