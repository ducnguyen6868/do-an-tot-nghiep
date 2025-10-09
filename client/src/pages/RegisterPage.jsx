import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/RegisterPage.css";
import { isValidEmail } from '../utils/isValidEmail';
import { useNavigate } from 'react-router-dom';
import authApi from "../api/authApi";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: true,
    });
    const [isHiddenPassword, setIsHiddenPassword] = useState(true);
    const [isHiddenConfirm, setIsHiddenConfirm] = useState(true);
    const [errors, setErrors] = useState({});
    const [focusedField, setFocusedField] = useState("");

    const [step, setStep] = useState(1);

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors({ ...errors, [name]: "" });
    };

    const handleRegisterSubmit = async () => {
        try {

            const response = await authApi.register(registerData);

            if (response) {
                toast.success(response.message);
                navigate('../login');
            }
        } catch (err) {
            toast.error(err.response.data.message || err.message);
        }
    };

    const handleMultipleButton = () => {
        if (step === 1) {
            const newErrors = {};

            if (!registerData.name) newErrors.name = "Please enter your full name.";
            if (!registerData.email) {
                newErrors.email = "Please enter your email";
            } else {
                if(!(isValidEmail(registerData.email))) newErrors.email = "Invalid email.";
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) {
                setStep(2);
            }
        }
        if (step === 2) {
            const newErrors = {};

            if (registerData.password.length < 8)
                newErrors.password = "Password must be at least 8 characters.";
            if (registerData.password !== registerData.confirmPassword)
                newErrors.confirmPassword = "Passwords do not match.";
            if (!registerData.agreeTerms)
                newErrors.agreeTerms = "You must agree to our Terms.";

            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) return;
            handleRegisterSubmit();
        }
    }
    return (
        <>
            <div className="register-section">
                <div className="register-container">
                    <div className="register-header">
                        <h2 className="form-title">Create Your Account</h2>
                        <p className="form-subtitle">Join our exclusive community of watch enthusiasts</p>
                    </div>

                    {step === 1 && (
                        <>
                            {/* Full Name */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:account-outline" width="18" />
                                    <span>Full Name</span>
                                </label>
                                <div className={`input-wrapper ${focusedField === "name" ? "focused" : ""} ${errors.name ? "error" : ""}`} >
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        onFocus={() => setFocusedField("name")}
                                        onBlur={() => setFocusedField("")}
                                        placeholder="John Doe"
                                        className="form-input"
                                    />
                                </div>
                                {errors.name && <span className="error-text">{errors.name}</span>}


                            </div>
                            {/* Email */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:email-outline" width="18" />
                                    <span>Email Address</span>
                                </label>
                                <div
                                    className={`input-wrapper ${focusedField === "email" ? "focused" : ""
                                        } ${errors.email ? "error" : ""}`}
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField("")}
                                        placeholder="your@email.com"
                                        className="form-input"
                                    />
                                </div>
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                        </>

                    )}

                    {step === 2 && (
                        <>
                            {/* Password */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:lock-outline" width="18" />
                                    <span>Password</span>
                                </label>
                                <div
                                    className={`input-wrapper ${focusedField === "password" ? "focused" : ""
                                        } ${errors.password ? "error" : ""}`}
                                >
                                    <input
                                        type={isHiddenPassword ? "password" : "text"}
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        onFocus={() => setFocusedField("password")}
                                        onBlur={() => setFocusedField("")}
                                        placeholder="••••••••"
                                        className="form-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsHiddenPassword(!isHiddenPassword)}
                                        className="eye-btn"
                                    >
                                        <Icon
                                            icon={isHiddenPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                                            width="20"
                                        />
                                    </button>
                                </div>
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:shield-lock-outline" width="18" />
                                    <span>Confirm Password</span>
                                </label>
                                <div
                                    className={`input-wrapper ${focusedField === "confirmPassword" ? "focused" : ""
                                        } ${errors.confirmPassword ? "error" : ""}`}
                                >
                                    <input
                                        type={isHiddenConfirm ? "password" : "text"}
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        onFocus={() => setFocusedField("confirmPassword")}
                                        onBlur={() => setFocusedField("")}
                                        placeholder="••••••••"
                                        className="form-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsHiddenConfirm(!isHiddenConfirm)}
                                        className="eye-btn"
                                    >
                                        <Icon
                                            icon={isHiddenConfirm ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                                            width="20"
                                        />
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="error-text">{errors.confirmPassword}</span>
                                )}
                            </div>

                            {/* Checkboxes */}
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={registerData.agreeTerms}
                                        onChange={handleRegisterChange}
                                    />
                                    <span>
                                        I agree to the <Link to="#" className="link">Terms and Conditions</Link>
                                    </span>
                                </label>
                                {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    <button className="submit-btn" onClick={handleMultipleButton}>
                        {step === 1 ? 'Continue' : 'Create'}
                    </button>

                    {/* Divider */}
                    <div className="divider">
                        <div className="line" />
                        <span>Or continue with</span>
                        <div className="line" />
                    </div>

                    {/* Social buttons */}
                    <div className="social-buttons">
                        <button className="social-btn google">
                            <Icon icon="logos:google-icon" width="20" />
                            <span>Google</span>
                        </button>
                        <button className="social-btn facebook">
                            <Icon icon="logos:facebook" width="20" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <p className="login-text">
                        Already have an account? <Link to="../login" className="link">Sign In</Link>
                    </p>
                </div>
            </div >
        </>
    );
};


