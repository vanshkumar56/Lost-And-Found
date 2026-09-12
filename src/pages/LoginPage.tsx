import { Link } from "@tanstack/react-router";
import "@/styles/login.css";

export function LoginPage() {
  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="bg-orb orb-one"></div>
        <div className="bg-orb orb-two"></div>
        <div className="bg-grid"></div>
      </div>

      <main className="login-container">
        {/* Left / Brand section */}
        <section className="login-brand">
          <div className="brand-badge">
            <span className="brand-dot"></span>
            Lost & Found
          </div>

          <h1>
            Find what matters.
            <span>Return what’s lost.</span>
          </h1>

          <p>
            A simple place to report, discover, and reconnect people with
            their lost belongings.
          </p>

          <div className="brand-stats">
            <div>
              <strong>24/7</strong>
              <span>Community</span>
            </div>

            <div className="stat-divider"></div>

            <div>
              <strong>Fast</strong>
              <span>Matching</span>
            </div>

            <div className="stat-divider"></div>

            <div>
              <strong>Safe</strong>
              <span>Connections</span>
            </div>
          </div>
        </section>

        {/* Login card */}
        <section className="login-card">
          <div className="login-card-header">
            <div className="login-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your account</p>
            </div>
          </div>

          <form className="login-form">
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M3 7L12 13L21 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label="Show password"
                  onClick={(e) => {
                    const input = document.getElementById(
                      "password"
                    ) as HTMLInputElement;

                    if (input.type === "password") {
                      input.type = "text";
                      e.currentTarget.setAttribute(
                        "aria-label",
                        "Hide password"
                      );
                    } else {
                      input.type = "password";
                      e.currentTarget.setAttribute(
                        "aria-label",
                        "Show password"
                      );
                    }
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="custom-checkbox"></span>
                Remember me
              </label>
            </div>

            {/* Existing dashboard route preserved */}
            <Link to="/dashboard" className="login-button">
              <span>Login</span>

              <span className="button-arrow">
                →
              </span>
            </Link>
          </form>

          <div className="divider">
            <span>New here?</span>
          </div>

          {/* Existing signup route preserved */}
          <Link to="/signup" className="signup-link">
            Create your account
            <span>→</span>
          </Link>

          <p className="security-note">
            <span className="security-dot"></span>
            Your information is securely protected
          </p>
        </section>
      </main>

      <footer className="login-footer">
        © {new Date().getFullYear()} Lost & Found
      </footer>
    </div>
  );
}