import { Link, NavLink, useNavigate } from "react-router-dom";
import { Droplets, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const homePath = user ? (user.role === "officer" ? "/officer" : "/citizen") : "/";

  const links = [
    { to: "/", label: t("navHome") },
    { to: "/faq", label: t("navFaq") },
  ];

  return (
    <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur border-b border-line">
      <div className="container-page flex items-center justify-between h-16">
        <Link to={homePath} className="flex items-center gap-2 font-display font-semibold text-lg text-ink">
          <span className="h-9 w-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-pop">
            <Droplets size={18} />
          </span>
          {t("appName")}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium transition ${
                  isActive ? "bg-teal-50 text-teal-600" : "text-subink hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="text-xs text-subink">
                {user.name} · <span className="text-teal-600 font-semibold">{user.role === "officer" ? "Officer" : "Citizen"}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary !py-2">
                {t("navLogout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2">
                {t("navLogin")}
              </Link>
              <Link to="/signup" className="btn-primary !py-2">
                {t("navSignup")}
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-surface px-5 py-4 space-y-3">
          <LanguageSwitcher compact />
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-sm font-medium text-ink py-1.5">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary w-full">
              {t("navLogout")}
            </button>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">
                {t("navLogin")}
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1">
                {t("navSignup")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
