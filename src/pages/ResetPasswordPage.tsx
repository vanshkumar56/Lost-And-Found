import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSignIn } from "@clerk/clerk-react";
import { clearPendingEmail, getPendingEmail } from "@/lib/auth-flow";
import "@/styles/forgot-password.css";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const email = getPendingEmail();

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Start again from Forgot Password to get a reset code.");
      return;
    }
    if (code.trim().length !== 6) {
      setMessage("Enter the 6-digit code sent to your email.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        clearPendingEmail();
        navigate({ to: "/dashboard" });
      } else {
        setMessage("Password reset is not complete. Please try again.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not reset the password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-bg">
        <div className="forgot-orb forgot-orb-1" />
        <div className="forgot-orb forgot-orb-2" />
        <div className="forgot-grid" />
      </div>

      <main className="forgot-container">
        <div className="forgot-brand">
          <span className="brand-dot" />
          Lost &amp; Found
        </div>

        <section className="forgot-card">
          <div className="forgot-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </div>

          <div className="forgot-header">
            <h1>Set a New Password</h1>
            <p>Enter the 6-digit code we sent to {email || "your email"}, then choose a new password.</p>
          </div>

          <form onSubmit={handleUpdatePassword}>
            <div className="forgot-input-group">
              <label htmlFor="reset-code">Verification code</label>
              <div className="forgot-input-wrapper">
                <input
                  id="reset-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            <div className="forgot-input-group">
              <label htmlFor="new-password">New password</label>
              <div className="forgot-input-wrapper">
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="forgot-input-group">
              <label htmlFor="confirm-password">Confirm new password</label>
              <div className="forgot-input-wrapper">
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {message && <p role="status">{message}</p>}

            <button type="submit" className="reset-password-button" disabled={loading}>
              <span>{loading ? "Updating..." : "Update password"}</span>
              <span className="reset-arrow">→</span>
            </button>
          </form>

          <Link to="/" className="back-link">
            <span>←</span> Back to login
          </Link>

          <div className="forgot-security">
            <span>Your information is securely protected</span>
          </div>
        </section>
      </main>

      <footer className="forgot-footer">© {new Date().getFullYear()} Lost &amp; Found</footer>
    </div>
  );
}