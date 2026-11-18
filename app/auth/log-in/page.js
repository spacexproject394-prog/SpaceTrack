"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function LogInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }
    // TODO: POST to /api/auth/log-in once the backend exists.
    setError("");
    alert("Logged in successfully!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo size={40} />
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold">Log In</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
          >
            Log In
          </button>

          <p className="mt-4 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
