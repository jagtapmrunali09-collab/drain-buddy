import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplets, User, ShieldCheck } from "lucide-react";
import { api } from "../api.js";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen" });
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
    <div className="container-page py-14 max-w-md">
      <div className="text-center mb-8">
        <span className="h-12 w-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto mb-4">
          <Droplets size={22} />
        </span>
        <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
        <p className="text-sm text-subink mt-1">Report issues, track complaints, and view live flood risk.</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Aditi Sharma" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} className="input" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 6 characters" />
          </div>

          <div>
            <span className="label">I am signing up as</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update("role", "citizen")}
                className={`rounded-lg border px-3.5 py-3 text-sm font-medium flex items-center gap-2 transition ${
                  form.role === "citizen" ? "border-teal-500 bg-teal-50 text-teal-600" : "border-line text-subink"
                }`}
              >
                <User size={16} /> Citizen
              </button>
              <button
                type="button"
                onClick={() => update("role", "officer")}
                className={`rounded-lg border px-3.5 py-3 text-sm font-medium flex items-center gap-2 transition ${
                  form.role === "officer" ? "border-teal-500 bg-teal-50 text-teal-600" : "border-line text-subink"
                }`}
              >
                <ShieldCheck size={16} /> Municipal officer
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3.5 py-2.5">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-subink mt-5">
        Already have an account? <Link to="/login" className="text-teal-600 font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
