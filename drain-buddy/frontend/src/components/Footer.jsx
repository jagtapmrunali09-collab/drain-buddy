import { Link } from "react-router-dom";
import { Droplets } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-10">
      <div className="container-page py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-ink mb-2">
            <span className="h-8 w-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
              <Droplets size={16} />
            </span>
            Drain-Buddy
          </div>
          <p className="text-xs text-subink max-w-xs">
            Predictive drainage monitoring and flood prevention for smarter, safer cities.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-subink">
            <li><Link to="/" className="hover:text-teal-600">Home</Link></li>
            <li><Link to="/faq" className="hover:text-teal-600">FAQ</Link></li>
            <li><Link to="/login" className="hover:text-teal-600">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Emergency</p>
          <p className="text-sm text-subink">Ambulance: <span className="font-mono">108</span></p>
          <p className="text-sm text-subink">Disaster helpline: <span className="font-mono">1077</span></p>
        </div>
      </div>
      <div className="border-t border-line py-4">
        <p className="text-center text-xs text-subink">© {new Date().getFullYear()} Drain-Buddy. All rights reserved.</p>
      </div>
    </footer>
  );
}
