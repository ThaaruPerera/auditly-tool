import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const loginResult = await login({ email, password });

    if (!loginResult.ok) {
      setError(loginResult.error);
      setIsSubmitting(false);
      return;
    }

    setError("");
    setIsSubmitting(false);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    const loginResult = await signInWithGoogle(redirectTo);

    if (!loginResult.ok) {
      setError(loginResult.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <SiteHeader
        navItems={[
          { label: "Home", to: "/" },
          { label: "Dashboard", to: "/dashboard" },
          { label: "History", to: "/history" }
        ]}
        ctaLabel="Sign Up"
        ctaTo="/signup"
        navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
        navItemActiveClassName="text-lime-400 font-semibold"
        ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
      />

      <main className="auth-content">
        <div className="auth-card">
          <h1>Login to Auditly</h1>
          <p>Securely access your account and resume audits.</p>

          <button
            type="button"
            className="auth-google-button"
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
          >
            <span className="auth-google-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don’t have an account? <Link to="/signup" state={location.state}>Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
