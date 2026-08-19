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
      {/* Your actual header title elements */}
    </div>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Put your actual input fields here */}
      
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  </div>
)};