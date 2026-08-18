import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-mono text-teal-600 mb-2">404</p>
      <h1 className="text-2xl font-semibold text-ink mb-3">Page not found</h1>
      <p className="text-sm text-subink mb-6">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
