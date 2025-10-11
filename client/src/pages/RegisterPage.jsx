import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
                if (!(isValidEmail(registerData.email))) newErrors.email = "Invalid email.";
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
            <div className="login-section register-section">
                <div className="login-container register-container">
                    <div className="login-header register-header">
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
                                <input
                                    type="text"
                                    name="name"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    placeholder="John Doe"
                                    className={errors.name ? "error" : ""}
                                />
                                {errors.name && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.name}</span>
                                    </div>
                                )}

                            </div>
                            {/* Email */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:email-outline" width="18" />
                                    <span>Email Address</span>
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    placeholder="your@email.com"
                                    className={errors.email ? "error" : ""}

                                />
                                {errors.email && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
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
                                <div className="form-input">
                                    <input
                                        type={isHiddenPassword ? "password" : "text"}
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        className={errors.password ? "error" : ""}
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
                                {errors.password && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label className="input-label">
                                    <Icon icon="mdi:shield-lock-outline" width="18" />
                                    <span>Confirm Password</span>
                                </label>
                                <div className="form-input">
                                    <input
                                        type={isHiddenConfirm ? "password" : "text"}
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        className={errors.confirmPassword ? "error" : ""}
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
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.confirmPassword}</span>
                                    </div>
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


