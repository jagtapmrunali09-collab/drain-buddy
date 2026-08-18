import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplets } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      login(data.token, data.user);
      const dest = location.state?.from?.pathname || (data.user.role === "officer" ? "/officer" : "/citizen");
      navigate(dest);
    } catch (err) {
      if (err.message?.toLowerCase().includes("verify")) {
        navigate("/verify", { state: { email: form.email } });
        return;
      }
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
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="text-sm text-subink mt-1">Sign in to your Drain-Buddy account.</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="input" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          {error && <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3.5 py-2.5">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-subink mt-5">
        New here? <Link to="/signup" className="text-teal-600 font-semibold">Create an account</Link>
      </p>
    </div>
  );
}
