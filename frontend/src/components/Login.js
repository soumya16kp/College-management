import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

// Make sure these imports are correct for your project structure
import { login as authLogin } from "../store/AuthSlice";
import authService from "../services/authService";
import Input from "./Input"; // Assuming you have a custom Input component
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);

      if (response && response.user) {
        dispatch(authLogin(response.user));
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div>
        <h2>Welcome Back</h2>

        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>

        {error && <p className="error-message">⚠️ {error}</p>}

        <form onSubmit={handleSubmit(handleLogin)} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <Input
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email format",
                },
              })}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "" : "Login"}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;