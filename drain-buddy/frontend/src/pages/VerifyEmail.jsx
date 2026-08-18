import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;
  const devCode = location.state?.devCode;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(devCode ? `Demo mode: your verification code is ${devCode}` : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.verify({ email, code });
      login(data.token, data.user);
      navigate(data.user.role === "officer" ? "/officer" : "/citizen");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      const data = await api.resendCode({ email });
      setInfo(`A new code was generated: ${data.devVerificationCode}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container-page py-14 max-w-md">
      <div className="text-center mb-8">
        <span className="h-12 w-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto mb-4">
          <MailCheck size={22} />
        </span>
        <h1 className="text-2xl font-semibold text-ink">Verify your email</h1>
        <p className="text-sm text-subink mt-1">
          We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>.
        </p>
      </div>

      <div className="card p-6">
        {info && <p className="text-xs text-teal-600 bg-teal-50 rounded-lg px-3.5 py-2.5 mb-4">{info}</p>}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="label" htmlFor="code">Verification code</label>
            <input
              id="code"
              required
              maxLength={6}
              className="input tracking-[0.4em] text-center text-lg font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3.5 py-2.5">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
        </form>
        <button onClick={handleResend} className="btn-ghost w-full mt-3">
          Resend code
        </button>
      </div>

      <p className="text-xs text-subink text-center mt-5">
        In production this code is delivered by email via an SMTP provider — see the README for wiring up a real sender.
      </p>
    </div>
  );
}
