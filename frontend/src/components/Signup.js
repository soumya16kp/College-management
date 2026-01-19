import { useState } from "react";
import authService from "../services/authService";
import Input from "./Input";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/AuthSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    // Password strength checker
    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength("");
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            setPasswordStrength("weak");
        } else if (strength <= 4) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("strong");
        }
    };

    const createAccount = async (data) => {
        setServerError("");
        try {
            const userData = await authService.signup(data.username, data.email, data.password);

            if (userData) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    dispatch(login(currentUser));
                    navigate("/");
                }
            }
        } catch (error) {

            if (error.response) {
                const errorData = error.response.data;
                const errorMessages = Object.keys(errorData).map(key =>
                    `${key}: ${errorData[key].join(', ')}`
                ).join(' ');
                setServerError(errorMessages);
                console.error("Signup failed:", errorData);
            } else {
                setServerError("An unexpected error occurred. Please try again.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signup-container">
            <div>
                <h2>Create Account</h2>
                <p>Already have an account? <Link to="/login">Sign In</Link></p>

                {serverError && <p className="error-message">⚠️ {serverError}</p>}

                <form onSubmit={handleSubmit(createAccount)} className="signup-form">

                    <div className="input-group">
                        <label>Username</label>
                        <Input
                            placeholder="Choose a username"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([-.]?\w+)*@\w+([-.]?\w+)*(\.\w{2,3})+$/,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            onChange={(e) => checkPasswordStrength(e.target.value)}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>

                        {passwordStrength && (
                            <div className="password-strength">
                                <div className={`password-strength ${passwordStrength}`}>
                                    Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                                </div>
                                <div className="strength-bar">
                                    <div className={`strength-bar-fill ${passwordStrength}`}></div>
                                </div>
                            </div>
                        )}

                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`signup-button ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "" : "Create Account"}
                    </button>
                </form>

                <p className="terms-text">
                    By signing up, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;