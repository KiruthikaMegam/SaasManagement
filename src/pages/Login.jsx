import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logoIcon from "../assets/logo.png";
import profileIcon from "../assets/profile.png";
import closeIcon from "../assets/close.png";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("saasLogin");

    if (isLoggedIn === "true") {
      navigate("/Dashboard", {
        replace: true
      });
    }
  }, [navigate]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginForm((previousValue) => ({
      ...previousValue,
      [name]: value
    }));

    setErrors((previousValue) => ({
      ...previousValue,
      [name]: ""
    }));
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupForm((previousValue) => ({
      ...previousValue,
      [name]: value
    }));

    setErrors((previousValue) => ({
      ...previousValue,
      [name]: ""
    }));
  };

  const validateLogin = () => {
    const newErrors = {};

    if (loginForm.email === "") {
      newErrors.email = "Email is required.";
    } else if (!loginForm.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (loginForm.password === "") {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};

    if (signupForm.name === "") {
      newErrors.name = "Name is required.";
    } else if (signupForm.name.length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (signupForm.email === "") {
      newErrors.email = "Email is required.";
    } else if (!signupForm.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (signupForm.password === "") {
      newErrors.password = "Password is required.";
    } else if (signupForm.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (signupForm.confirmPassword === "") {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      signupForm.password !== signupForm.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!validateLogin()) {
      return;
    }

    const savedUser = localStorage.getItem("saasUser");

    if (savedUser === null) {
      showMessage(
        "No account found. Please create an account first.",
        "error"
      );
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      showMessage(
        "Saved account data is invalid. Please sign up again.",
        "error"
      );
      return;
    }

    if (
      user.email.toLowerCase() !==
        loginForm.email.toLowerCase() ||
      user.password !== loginForm.password
    ) {
      showMessage(
        "Invalid email or password.",
        "error"
      );
      return;
    }

    localStorage.setItem("saasLogin", "true");

    localStorage.setItem(
      "saasCurrentUser",
      JSON.stringify({
        name: user.name,
        email: user.email
      })
    );

    showMessage(
      "Login successful. Welcome back!",
      "success"
    );

    setTimeout(() => {
      navigate("/Dashboard");
    }, 700);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    if (!validateSignup()) {
      return;
    }

    const savedUser = localStorage.getItem("saasUser");

    if (savedUser !== null) {
      let existingUser = null;

      try {
        existingUser = JSON.parse(savedUser);
      } catch (error) {
        existingUser = null;
      }

      if (
        existingUser &&
        existingUser.email &&
        existingUser.email.toLowerCase() ===
          signupForm.email.toLowerCase()
      ) {
        showMessage(
          "An account with this email already exists.",
          "error"
        );
        return;
      }
    }

    const newUser = {
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      "saasUser",
      JSON.stringify(newUser)
    );

    setSignupForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    setErrors({});

    setIsSignup(false);

    setLoginForm({
      email: newUser.email,
      password: ""
    });

    showMessage(
      "Account created successfully. Please login.",
      "success"
    );
  };

  const switchToSignup = () => {
    setIsSignup(true);
    setErrors({});
    setMessage("");
    setMessageType("");
  };

  const switchToLogin = () => {
    setIsSignup(false);
    setErrors({});
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="saas-auth-page">

      <div className="saas-auth-background-circle saas-auth-circle-one"></div>
      <div className="saas-auth-background-circle saas-auth-circle-two"></div>
      <div className="saas-auth-background-circle saas-auth-circle-three"></div>

      <div className="saas-auth-container">

        {/* =========================
            LEFT SECTION
        ========================= */}

        <div className="saas-auth-left">

          <div className="saas-auth-brand">
            <div className="saas-auth-logo">
              <img
                src={logoIcon}
                alt="SaaS Management"
              />
            </div>

            <div>
              <strong>SaaSify</strong>
              <span>Management Dashboard</span>
            </div>
          </div>

          <div className="saas-auth-left-content">
            <span className="saas-auth-tag">
              SAAS MANAGEMENT PLATFORM
            </span>

            <h1>
              Manage your SaaS
              <span> business smarter.</span>
            </h1>

            <p>
              Manage users, customers, subscriptions,
              pricing plans, usage and revenue from one
              powerful dashboard.
            </p>

            <div className="saas-auth-features">

              <div className="saas-auth-feature">
                <span>✓</span>
                <div>
                  <strong>Complete Management</strong>
                  <small>
                    Manage your entire SaaS platform
                    in one place.
                  </small>
                </div>
              </div>

              <div className="saas-auth-feature">
                <span>✓</span>
                <div>
                  <strong>Real-time Analytics</strong>
                  <small>
                    Track revenue, usage and
                    subscription performance.
                  </small>
                </div>
              </div>

              <div className="saas-auth-feature">
                <span>✓</span>
                <div>
                  <strong>Simple & Secure</strong>
                  <small>
                    Easy access to your business
                    management tools.
                  </small>
                </div>
              </div>

            </div>
          </div>

          <div className="saas-auth-left-footer">
            © 2026 SaaSify. All rights reserved.
          </div>

        </div>


        {/* =========================
            RIGHT SECTION
        ========================= */}

        <div className="saas-auth-right">

          <div className="saas-auth-card">

            <div className="saas-auth-mobile-logo">
              <div className="saas-auth-logo">
                <img
                  src={logoIcon}
                  alt="SaaS Management"
                />
              </div>

              <strong>SaaSify</strong>
            </div>

            <div className="saas-auth-header">

              <div className="saas-auth-user-icon">
                <img
                  src={profileIcon}
                  alt=""
                />
              </div>

              <h2>
                {isSignup
                  ? "Create your account"
                  : "Welcome back!"}
              </h2>

              <p>
                {isSignup
                  ? "Create your SaaS management account"
                  : "Sign in to manage your SaaS business"}
              </p>

            </div>


            {/* =========================
                MESSAGE
            ========================= */}

            {message !== "" && (
              <div
                className={
                  messageType === "error"
                    ? "saas-auth-message saas-auth-message-error"
                    : "saas-auth-message saas-auth-message-success"
                }
                role="alert"
              >
                <span>{message}</span>

                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setMessageType("");
                  }}
                  aria-label="Close message"
                >
                  <img
                    src={closeIcon}
                    alt=""
                  />
                </button>
              </div>
            )}


            {/* =========================
                LOGIN
            ========================= */}

            {!isSignup && (
              <form
                className="saas-auth-form"
                onSubmit={handleLogin}
              >

                <div className="saas-auth-field">

                  <label htmlFor="login-email">
                    Email Address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={
                      errors.email
                        ? "saas-auth-input saas-auth-input-error"
                        : "saas-auth-input"
                    }
                  />

                  {errors.email && (
                    <span className="saas-auth-error">
                      {errors.email}
                    </span>
                  )}

                </div>


                <div className="saas-auth-field">

                  <div className="saas-auth-label-row">
                    <label htmlFor="login-password">
                      Password
                    </label>

                    <button
                      type="button"
                      className="saas-auth-forgot"
                      onClick={() =>
                        showMessage(
                          "Please contact your administrator to reset your password.",
                          "info"
                        )
                      }
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="saas-auth-password-wrapper">

                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={
                        errors.password
                          ? "saas-auth-input saas-auth-input-error"
                          : "saas-auth-input"
                      }
                    />

                    <button
                      type="button"
                      className="saas-auth-password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (previousValue) =>
                            !previousValue
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                  {errors.password && (
                    <span className="saas-auth-error">
                      {errors.password}
                    </span>
                  )}

                </div>


                <label className="saas-auth-checkbox">
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>
                    Remember me
                  </span>
                </label>


                <button
                  type="submit"
                  className="saas-auth-submit"
                >
                  Sign In
                </button>

              </form>
            )}


            {/* =========================
                SIGNUP
            ========================= */}

            {isSignup && (
              <form
                className="saas-auth-form"
                onSubmit={handleSignup}
              >

                <div className="saas-auth-field">

                  <label htmlFor="signup-name">
                    Full Name
                  </label>

                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={
                      errors.name
                        ? "saas-auth-input saas-auth-input-error"
                        : "saas-auth-input"
                    }
                  />

                  {errors.name && (
                    <span className="saas-auth-error">
                      {errors.name}
                    </span>
                  )}

                </div>


                <div className="saas-auth-field">

                  <label htmlFor="signup-email">
                    Email Address
                  </label>

                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={
                      errors.email
                        ? "saas-auth-input saas-auth-input-error"
                        : "saas-auth-input"
                    }
                  />

                  {errors.email && (
                    <span className="saas-auth-error">
                      {errors.email}
                    </span>
                  )}

                </div>


                <div className="saas-auth-field">

                  <label htmlFor="signup-password">
                    Password
                  </label>

                  <div className="saas-auth-password-wrapper">

                    <input
                      id="signup-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className={
                        errors.password
                          ? "saas-auth-input saas-auth-input-error"
                          : "saas-auth-input"
                      }
                    />

                    <button
                      type="button"
                      className="saas-auth-password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (previousValue) =>
                            !previousValue
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                  {errors.password && (
                    <span className="saas-auth-error">
                      {errors.password}
                    </span>
                  )}

                </div>


                <div className="saas-auth-field">

                  <label htmlFor="signup-confirm-password">
                    Confirm Password
                  </label>

                  <div className="saas-auth-password-wrapper">

                    <input
                      id="signup-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        signupForm.confirmPassword
                      }
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className={
                        errors.confirmPassword
                          ? "saas-auth-input saas-auth-input-error"
                          : "saas-auth-input"
                      }
                    />

                    <button
                      type="button"
                      className="saas-auth-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previousValue) =>
                            !previousValue
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  {errors.confirmPassword && (
                    <span className="saas-auth-error">
                      {errors.confirmPassword}
                    </span>
                  )}

                </div>


                <label className="saas-auth-checkbox">

                  <input
                    type="checkbox"
                    required
                  />

                  <span>
                    I agree to the terms and privacy policy.
                  </span>

                </label>


                <button
                  type="submit"
                  className="saas-auth-submit"
                >
                  Create Account
                </button>

              </form>
            )}


            {/* =========================
                SWITCH LOGIN / SIGNUP
            ========================= */}

            <div className="saas-auth-switch">

              <span>
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                type="button"
                onClick={
                  isSignup
                    ? switchToLogin
                    : switchToSignup
                }
              >
                {isSignup
                  ? "Sign In"
                  : "Create Account"}
              </button>

            </div>


            <div className="saas-auth-security">
              <span>🔒</span>
              <p>
                Your account information is stored
                securely in your browser.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;