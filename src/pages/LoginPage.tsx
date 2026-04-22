import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import React, { useState } from "react";

export default function LoginPage({ isSignup = false }: { isSignup?: boolean }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save user's name if it's signup, or fallback to email prefix if you prefer
    // Since we mock backend, we store it in localStorage
    if (isSignup && name) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
    } else if (!isSignup) {
      if (email) localStorage.setItem('userEmail', email);
    }
    // Simulate login/signup and navigate to onboarding
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 mb-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">
              {isSignup ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignup ? "Sign up to get started" : "Sign in to your account"}
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none mb-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider bg-white px-2">
              Or continue with email
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="pl-10 w-full rounded-lg border border-gray-200 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 w-full rounded-lg border border-gray-200 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10 w-full rounded-lg border border-gray-200 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-900 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 py-2.5 rounded-lg transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSignup ? "Sign up" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link to={isSignup ? "/login" : "/signup"} className="text-indigo-600 font-medium hover:underline">
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
