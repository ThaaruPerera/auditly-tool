import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const signupResult = await signUp({ name, email, password });

    if (!signupResult.ok) {
      setError(signupResult.error);
      setIsSubmitting(false);
      return;
    }

    setError("");
    setIsSubmitting(false);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsSubmitting(true);

    const signupResult = await signInWithGoogle(redirectTo);

    if (!signupResult.ok) {
      setError(signupResult.error);
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
        ctaLabel="Login"
        ctaTo="/login"
        navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
        navItemActiveClassName="text-lime-400 font-semibold"
        ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
      />

      <main className="auth-content">
        <div className="auth-card">
          <h1>Create an account</h1>
          <p>Join Auditly and start auditing websites instantly.</p>

          <button
            type="button"
            className="auth-google-button"
            disabled={isSubmitting}
            onClick={handleGoogleSignup}
          >
            <span className="auth-google-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>

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
                placeholder="Choose a password"
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" state={location.state}>Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;
