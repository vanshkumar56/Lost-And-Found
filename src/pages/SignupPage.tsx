import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import "@/styles/signup.css";

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validateEmail = (email: string) => {
    const value = email.trim();

    /*
     * Checks:
     * name@example.com
     * valid domain
     * domain must contain a proper extension
     */
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    return emailRegex.test(value);
  };

  const checkPassword = (value: string) => {
    setPasswordChecks({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      terms: "",
    };

    let isValid = true;

    /* Name */
    if (!name.trim()) {
      newErrors.name = "Please enter your full name.";
      isValid = false;
    }

    /* Email */
    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email =
        "Please enter a valid email address with a valid domain.";
      isValid = false;
    }

    /* Password */
    const passwordIsValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!password) {
      newErrors.password = "Please create a password.";
      isValid = false;
    } else if (!passwordIsValid) {
      newErrors.password =
        "Password does not meet all security requirements.";
      isValid = false;
    }

    /* Terms */
    const termsCheckbox = document.getElementById(
      "signup-terms"
    ) as HTMLInputElement | null;

    if (!termsCheckbox?.checked) {
      newErrors.terms =
        "Please accept the Terms of Service and Privacy Policy.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Keep your existing route exactly the same
    navigate({
      to: "/verify-otp",
    });
  };

  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);

    checkPassword(value);

    if (errors.password) {
      setErrors((previous) => ({
        ...previous,
        password: "",
      }));
    }
  };

  return (
    <div className="signup-page">
      {/* Background */}
      <div className="signup-bg">
        <div className="signup-orb signup-orb-1" />
        <div className="signup-orb signup-orb-2" />
        <div className="signup-grid" />
      </div>

      <main className="signup-container">
        {/* Brand */}
        <div className="signup-brand">
          <span className="signup-brand-dot" />
          Lost & Found
        </div>

        {/* Card */}
        <section className="signup-card">

          {/* Icon */}
          <div className="signup-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M4 21C4 17.6863 7.58172 15 12 15C16.4183 15 20 17.6863 20 21"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M19 8V12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M17 10H21"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Header */}
          <div className="signup-header">
            <h1>Create your account</h1>

            <p>
              Join the community and help reunite people
              with their lost belongings.
            </p>
          </div>

          {/* Form */}
          <form
            className="signup-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* NAME */}
            <div className="signup-input-group">
              <label htmlFor="signup-name">
                Full name
              </label>

              <div
                className={`signup-input-wrapper ${
                  errors.name ? "input-error" : ""
                }`}
              >
                <svg
                  className="signup-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  onChange={(e) => {
                    setName(e.target.value);

                    if (errors.name) {
                      setErrors((previous) => ({
                        ...previous,
                        name: "",
                      }));
                    }
                  }}
                />
              </div>

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* EMAIL */}
            <div className="signup-input-group">
              <label htmlFor="signup-email">
                Email address
              </label>

              <div
                className={`signup-input-wrapper ${
                  errors.email ? "input-error" : ""
                }`}
              >
                <svg
                  className="signup-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
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
                  id="signup-email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors((previous) => ({
                        ...previous,
                        email: "",
                      }));
                    }
                  }}
                  onBlur={() => {
                    if (
                      email &&
                      !validateEmail(email)
                    ) {
                      setErrors((previous) => ({
                        ...previous,
                        email:
                          "Please enter a valid email address with a valid domain.",
                      }));
                    }
                  }}
                />
              </div>

              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="signup-input-group">
              <label htmlFor="signup-password">
                Password
              </label>

              <div
                className={`signup-input-wrapper ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <svg
                  className="signup-input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
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
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    handlePasswordChange(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              {/* Password security checklist */}
              <div className="password-security">
                <div
                  className={
                    passwordChecks.length
                      ? "password-check valid"
                      : "password-check"
                  }
                >
                  <span>
                    {passwordChecks.length
                      ? "✓"
                      : "○"}
                  </span>
                  At least 8 characters
                </div>

                <div
                  className={
                    passwordChecks.uppercase
                      ? "password-check valid"
                      : "password-check"
                  }
                >
                  <span>
                    {passwordChecks.uppercase
                      ? "✓"
                      : "○"}
                  </span>
                  One uppercase letter
                </div>

                <div
                  className={
                    passwordChecks.lowercase
                      ? "password-check valid"
                      : "password-check"
                  }
                >
                  <span>
                    {passwordChecks.lowercase
                      ? "✓"
                      : "○"}
                  </span>
                  One lowercase letter
                </div>

                <div
                  className={
                    passwordChecks.number
                      ? "password-check valid"
                      : "password-check"
                  }
                >
                  <span>
                    {passwordChecks.number
                      ? "✓"
                      : "○"}
                  </span>
                  One number
                </div>

                <div
                  className={
                    passwordChecks.special
                      ? "password-check valid"
                      : "password-check"
                  }
                >
                  <span>
                    {passwordChecks.special
                      ? "✓"
                      : "○"}
                  </span>
                  One special character
                </div>
              </div>

              {errors.password && (
                <span className="field-error">
                  {errors.password}
                </span>
              )}
            </div>

            {/* TERMS */}
            <label className="signup-terms">
              <input
                id="signup-terms"
                type="checkbox"
              />

              <span className="signup-checkbox" />

              <span>
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) =>
                    e.preventDefault()
                  }
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) =>
                    e.preventDefault()
                  }
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {errors.terms && (
              <span className="field-error terms-error">
                {errors.terms}
              </span>
            )}

            {/* VERIFY */}
            <button
              type="submit"
              className="verify-button"
            >
              <span>Verify</span>
              <span className="verify-arrow">
                →
              </span>
            </button>
          </form>

          {/* Login */}
          <div className="already-account">
            <span>
              Already have an account?
            </span>

            <a href="/">Login</a>
          </div>

          {/* Security */}
          <div className="signup-security">
            <span>●</span>
            Your information is securely protected
          </div>
        </section>
      </main>

      <footer className="signup-footer">
        © {new Date().getFullYear()} Lost & Found
      </footer>
    </div>
  );
}