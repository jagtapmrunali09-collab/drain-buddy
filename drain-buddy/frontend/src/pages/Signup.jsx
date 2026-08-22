import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplets, User, ShieldCheck } from "lucide-react";
import { api } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen", officerCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.signup(form);
      navigate("/verify", { state: { email: form.email, devCode: data.devVerificationCode } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-14 max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto mb-4">
          <Droplets size={22} />
        </div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-gray-600 text-sm mt-1">Report issues, track complaints, and view live flood risk.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="Aditi Sharma"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
          <input
            type="password"
            required
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">I am signing up as</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update("role", "citizen")}
              className={`py-2 px-3 border rounded-lg text-sm flex items-center justify-center gap-2 ${
                form.role === "citizen" ? "border-teal-600 bg-teal-50 text-teal-800 font-medium" : "border-gray-200 text-gray-600"
              }`}
            >
              <User size={16} /> Citizen
            </button>
            <button
              type="button"
              onClick={() => update("role", "officer")}
              className={`py-2 px-3 border rounded-lg text-sm flex items-center justify-center gap-2 ${
                form.role === "officer" ? "border-teal-600 bg-teal-50 text-teal-800 font-medium" : "border-gray-200 text-gray-600"
              }`}
            >
              <ShieldCheck size={16} /> Municipal officer
            </button>
          </div>
        </div>

        {form.role === "officer" && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Municipal Corporation Branch Code</label>
            <input
              type="text"
              required
              placeholder="e.g. PMC-001"
              value={form.officerCode}
              onChange={(e) => update("officerCode", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">Provided by your municipal corporation to verify your branch/ward.</p>
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account? <Link to="/login" className="text-teal-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}