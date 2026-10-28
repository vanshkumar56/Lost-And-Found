import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSignUp } from "@clerk/clerk-react";
import { clearPendingEmail, getPendingEmail } from "@/lib/auth-flow";
import "@/styles/verify-otp.css";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setEmail(getPendingEmail());
    inputRefs.current[0]?.focus();
  }, []);

  const handlePaste = (pastedValue: string) => {
    const numbers = pastedValue.replace(/\D/g, "").slice(0, 6);
    if (!numbers) return;

    const newOtp = ["", "", "", "", "", ""];
    numbers.split("").forEach((number, index) => {
      newOtp[index] = number;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(numbers.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (numbers.length > 1) {
      handlePaste(numbers);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numbers.charAt(0);
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    handlePaste(e.clipboardData.getData("text"));
  };

   async function handleVerify() {
    setMessage("");

    const token = otp.join("");

    if (!isLoaded || !signUp) return;

    if (token.length !== 6) {
      setMessage("Enter the 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
      let result = signUp;

      if (signUp.verifications.emailAddress.status !== "verified") {
        result = await signUp.attemptEmailAddressVerification({ code: token });
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        clearPendingEmail();
        navigate({ to: "/dashboard" });
        return;
      }

      setMessage(
        `Sign-up is not complete yet (status: ${result.status}). Check Clerk dashboard required fields.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not verify the code.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setMessage("");

    if (!email) {
      setMessage("Sign up again so we know which email to verify.");
      return;
    }
    if (!isLoaded) return;

    setIsResending(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setMessage("A new code has been sent to your email.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not resend the code.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="verify-otp-page">
      <div className="verify-bg">
        <div className="verify-orb verify-orb-1" />
        <div className="verify-orb verify-orb-2" />
        <div className="verify-grid" />
      </div>

      <main className="verify-container">
        <div className="verify-brand">
          <span className="verify-brand-dot" />
          Lost & Found
        </div>

        <section className="verify-card">
          <div className="verify-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="12" cy="15" r="1" fill="currentColor" />
              <path d="M12 16V18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>

          <div className="verify-header">
            <h1>Verify your account</h1>
            <p>
              We've sent a 6-digit verification code to
              {email ? <strong> {email}</strong> : " your email address"}. Enter it below to continue.
            </p>
          </div>

          <div className="otp-section">
            <label>Verification code</label>

            <div
              className="otp-inputs"
              onPaste={(e) => {
                e.preventDefault();
                handlePaste(e.clipboardData.getData("text"));
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  className={`otp-input ${digit ? "has-value" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  aria-label={`OTP digit ${index + 1}`}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePasteEvent}
                />
              ))}
            </div>

            <p className="otp-hint">Enter the 6-digit code sent to you</p>
          </div>

          {message && <p role="status">{message}</p>}

          <button
            type="button"
            className="verify-otp-button"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            <span>{isVerifying ? "Verifying..." : "Verify"}</span>
            <span className="verify-otp-arrow">→</span>
          </button>

          <div className="resend-section">
            <span>Didn't receive the code?</span>
            <button
              type="button"
              className="resend-button"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <Link to="/" className="back-login-link">
            <span>←</span>
            Back to login
          </Link>

          <div className="otp-security">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>Your verification code is private and secure</span>
          </div>
        </section>
      </main>

      <footer className="verify-footer">© {new Date().getFullYear()} Lost & Found</footer>
    </div>
  );
}