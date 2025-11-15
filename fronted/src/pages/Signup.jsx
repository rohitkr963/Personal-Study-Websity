import React, { useState } from "react";
import AnimatedModel from "../components/AnimatedModel";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../utils/authApi";

export default function Signup() {
  const [name, setName] = useState("");
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
      const res = await register({ name, email, password });
      if (res && res.token) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
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
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Create Account</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
              {error && <div className="text-red-600">{error}</div>}

              <div>
                <label className="text-sm text-slate-700 mb-2 block">Full name</label>
                <div className="flex items-center border rounded-full bg-white px-4 py-2 shadow-sm">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full outline-none text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700 mb-2 block">Email</label>
                <div className="flex items-center border rounded-full bg-white px-4 py-2 shadow-sm">
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
                <label className="text-sm text-slate-700 mb-2 block">Password</label>
                <div className="flex items-center border rounded-full bg-white px-4 py-2 shadow-sm">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                    className="w-full outline-none text-slate-700"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Use at least 6 characters.</p>
              </div>

              <div>
                <button disabled={loading} type="submit" className="w-48 h-12 rounded-full bg-amber-300 text-slate-800 font-semibold shadow-md">
                  {loading ? "Creating..." : "Sign up"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <div className="text-sm text-slate-500">- or -</div>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

            

              <div className="text-sm text-slate-600 mt-2">
                Already have an account? <Link to="/login" className="text-amber-700 font-semibold">Login</Link>
              </div>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="w-72 h-72 bg-amber-100 rounded-full flex items-center justify-center">
              <div className="w-64 h-64">
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
