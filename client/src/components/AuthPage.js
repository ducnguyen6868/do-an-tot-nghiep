import { useState } from 'react';
import '../css/AuthPage.css';
import { Icon } from "@iconify/react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import ForgotPasswordModal from './comon/ForgotPasswordModal';

export default function AuthPage({ onClose }) {
    const { getInfoUser } = useContext(UserContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPasswordModal, setIsForgotPasswordModal] = useState(false);

    const [isHiddenPassword, setIsHiddenPassword] = useState(true);

    const navigate = useNavigate();
    // Login state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: true
    });

    // Register state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: null,
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Handle login
    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({
            ...loginData,
            [name]: type === 'checkbox' ? checked : value
        });
        setErrors({ ...errors, [name]: '' });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!loginData.email) newErrors.email = 'Email is required';
        if (!loginData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // API login
        try {
            const response = await axios.post("http://localhost:5000/login", loginData);
            // console.log(response.data);
            if (response.data.status === "completed") {
                if (loginData.rememberMe) {
                    //Save token to localstorage 
                    localStorage.setItem("token", response.data.token);
                } else {
                    sessionStorage.setItem("token", response.data.token);
                }
                toast.success(response.data.message);
                setTimeout(() => onClose(), 1000);
                await getInfoUser();
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message || "Server error")
            } else if (err.request) {
                toast.error("No reponse from server")
            } else {
                toast.error("Request error :", err.message);
            }
        }

        // alert('Login successful! Welcome back.');
    };

    // Handle register
    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterData({
            ...registerData,
            [name]: type === 'checkbox' ? checked : value
        });
        setErrors({ ...errors, [name]: '' });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRegisterData({ ...registerData, avatar: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    //Submit form register

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!registerData.name) newErrors.name = 'Name is required';
        if (!registerData.email) newErrors.email = 'Email is required';
        if (!registerData.password) newErrors.password = 'Password is required';
        if (registerData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!registerData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // API regigter
        // console.log('Register data:', registerData);
        // alert('Registration successful! Please check your email to activate your account.');

        try {
            const formData = new FormData();
            formData.append("name", registerData.name);
            formData.append("email", registerData.email);
            formData.append("password", registerData.password);
            formData.append("avatar", registerData.avatar); // avatar là file (File object)

            const response = await axios.post("http://localhost:5000/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // console.log(response.data);
            if (response.data.status === "completed") {
                toast.success(response.data.message);
                setTimeout(() =>
                    setIsLogin(true),
                    setRegisterData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        avatar: null,
                        agreeTerms: false
                    }, setAvatarPreview(null)),
                    setLoginData({
                        email: registerData.email,
                        password: registerData.password,
                        rememberMe: true
                    })
                    , 2000);

            } else {
                toast.error(response.data.message);
            }
            // console.log(formData);
            // console.log(response.data);
        } catch (err) {
            console.log("Cann`t connect with database ", err);
            if (err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error(err.message);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Image/Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <div className="logo">
                            <span className="logo-icon1">⌚</span>
                            <span className="logo-text1">TIMEPIECE</span>
                        </div>
                        <h2 className="branding-title">Luxury Watches Collection</h2>
                        <p className="branding-desc">
                            Join thousands of satisfied customers and discover the finest timepieces from around the world.
                        </p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>100% Authentic Products</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Free Worldwide Shipping</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>2 Year Warranty</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>24/7 Customer Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Forms */}
                <div className='auth-forms' >
                    <div className={isForgotPasswordModal ? 'auth-forms-hidden' : ''} >
                        <button onClick={onClose} style={{ top: '10px', right: '10px', fontSize: '18px' }} className='close-btn'>X</button>
                        <div className="auth-toggle-box">
                            {/* Toggle Buttons */}
                            <div className="auth-toggle">
                                <button
                                    className={`toggle-btn ${isLogin ? 'active' : ''}`}
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </button>
                                <button
                                    className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                                    onClick={() => setIsLogin(false)}
                                >
                                    Register
                                </button>
                            </div>

                            {/* Login Form */}
                            {isLogin ? (
                                <div className="form-container">
                                    <h2 className="form-title">Welcome Back!</h2>
                                    <p className="form-subtitle">Login to your account to continue</p>

                                    <div className="login-form">
                                        <div className="form-group">
                                            <label htmlFor="emailLogin">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                placeholder="your@email.com"
                                                className={errors.email ? 'error' : ''}
                                                id="emailLogin"
                                            />
                                            {errors.email && <span className="error-text">{errors.email}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="passwordLogin">Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type={isHiddenPassword ? 'password' : 'text'}
                                                    name="password"
                                                    value={loginData.password}
                                                    onChange={handleLoginChange}
                                                    placeholder="••••••••"
                                                    className={errors.password ? 'error' : ''}
                                                    id="passwordLogin"
                                                />
                                                <span onClick={() => setIsHiddenPassword(!isHiddenPassword)} style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    {isHiddenPassword ? <Icon icon="noto:see-no-evil-monkey" width="40" height="40" /> : <Icon icon="noto:hear-no-evil-monkey" width="40" height="40" />}
                                                </span>
                                            </div>

                                            {errors.password && <span className="error-text">{errors.password}</span>}
                                        </div>

                                        <div className="form-options">
                                            <label htmlFor="rememberMe" className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="rememberMe"
                                                    id="rememberMe"
                                                    checked={loginData.rememberMe}
                                                    onChange={handleLoginChange}
                                                />
                                                <span>Remember me</span>
                                            </label>
                                            <button
                                                type="button"
                                                className="forgot-link"
                                                onClick={() => setIsForgotPasswordModal(true)}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>

                                        <button className="submit-btn" onClick={handleLoginSubmit}>
                                            Login to Account
                                        </button>

                                        <div className="divider">
                                            <span>Or continue with</span>
                                        </div>

                                        <div className="social-login">
                                            <button className="social-btn google">
                                                <Icon icon="logos:google-icon" width="30" height="50" /> Google
                                            </button>
                                            <button className="social-btn facebook">
                                                <Icon icon="logos:facebook" width="30" height="30" /> Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Register Form */
                                <div className="form-container">
                                    <h2 className="form-title">Create Account</h2>
                                    <p className="form-subtitle">Join us and start shopping</p>

                                    <div className="register-form">
                                        {/* Avatar Upload */}
                                        <div className="avatar-upload">
                                            <div className="avatar-preview">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar" />
                                                ) : (
                                                    <span className="avatar-placeholder">👤</span>
                                                )}
                                            </div>
                                            <label htmlFor="file" className="upload-btn">
                                                Upload Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    style={{ display: 'none' }}
                                                    id="file"
                                                />
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameRegister">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={registerData.name}
                                                onChange={handleRegisterChange}
                                                placeholder="John Doe"
                                                id="nameRegister"
                                                className={errors.name ? 'error' : ''}

                                            />
                                            {errors.name && <span className="error-text">{errors.name}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="emailRegister">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                placeholder="your@email.com"
                                                id="emailRegister"
                                                className={errors.email ? 'error' : ''}
                                            />
                                            {errors.email && <span className="error-text">{errors.email}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="passwordReigister">Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type={isHiddenPassword ? "password" : "text"}
                                                    name="password"
                                                    value={registerData.password}
                                                    onChange={handleRegisterChange}
                                                    placeholder="••••••••"
                                                    id="passwordRegister"
                                                    className={errors.password ? 'error' : ''}
                                                />
                                                <span onClick={() => setIsHiddenPassword(!isHiddenPassword)} style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    {isHiddenPassword ? <Icon icon="noto:see-no-evil-monkey" width="40" height="40" /> : <Icon icon="noto:hear-no-evil-monkey" width="40" height="40" />}
                                                </span>
                                            </div>
                                            {errors.password && <span className="error-text">{errors.password}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirmPasswordRegister">Confirm Password</label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type={isHiddenPassword ? "password" : "text"}
                                                    name="confirmPassword"
                                                    value={registerData.confirmPassword}
                                                    onChange={handleRegisterChange}
                                                    placeholder="••••••••"
                                                    id="confirmPasswordRegister"
                                                    className={errors.confirmPassword ? 'error' : ''}
                                                />
                                                <span onClick={() => setIsHiddenPassword(!isHiddenPassword)} style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    {isHiddenPassword ? <Icon icon="noto:see-no-evil-monkey" width="40" height="40" /> : <Icon icon="noto:hear-no-evil-monkey" width="40" height="40" />}
                                                </span>
                                            </div>
                                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                        </div>

                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="agreeTerms"
                                                checked={registerData.agreeTerms}
                                                onChange={handleRegisterChange}
                                            />
                                            <span>I agree to the Terms and Conditions</span>

                                        </label>
                                        {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}

                                        <button className="submit-btn" onClick={handleRegisterSubmit}>
                                            Create Account
                                        </button>

                                        <div className="divider">
                                            <span>Or continue with</span>
                                        </div>

                                        <div className="social-login">
                                            <button className="social-btn google">
                                                <Icon icon="logos:google-icon" width="30" height="50" /> Google
                                            </button>
                                            <button className="social-btn facebook">
                                                <Icon icon="logos:facebook" width="30" height="30" />Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Forgot password modal */}
                    {isForgotPasswordModal && <ForgotPasswordModal onCloseForgotModal={()=>{
                        setIsForgotPasswordModal(false)
                    }} />}
                </div>

            </div>


        </div>
    );
}