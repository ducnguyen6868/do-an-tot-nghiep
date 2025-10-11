import { useRef, useState, useEffect } from 'react';
import '../../styles/ForgotPasswordModal.css';
import { Icon } from '@iconify/react';
import { isValidEmail } from '../../utils/isValidEmail';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function ForgotPasswordModal({ onClose }) {
    const emailRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowpasswords] = useState({
        newPassword: false,
        confirmPassword: false
    });

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState({});
    const [countdown, setCountdown] = useState(0);


    const toggleVisibility = (key) => {
        setShowpasswords({
            ...showPasswords,
            [key]: !showPasswords[key]
        })
    }

    const handleBack = () => {
        if (loading) return;
        if (step === 1) {
            onClose?.();
        } else {
            setStep((prev) => prev - 1);
        }
    }

    const handleMultipleButton = () => {
        if (step === 1) {
            handleSendEmail();
        } else if (step === 2) {
            handleVirifyOTP();
        } else {
            handleResetPassword();
        }
    }

    const handleSendEmail = async () => {
        if (email === '') {
            setErrors({ email: 'Email is required.' });
            emailRef.current?.focus();
            return;
        }
        if (!isValidEmail(email)) {
            setErrors({ email: 'Please enter correct email format.' });
            emailRef.current?.focus();
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const response = await authApi.forgotPassword(email);
            if (response) {
                setErrors({});
                setCountdown(60);
                setStep(2);
            }
        } catch (err) {
            setErrors({ email: err.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    }

    const handleVirifyOTP = async () => {
        if (otp === '') {
            setErrors({ otp: "OTP is required." });
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            const response = await authApi.verifyOtp(email, otp);
            if (response) {
                setErrors({});
                setStep(3);
            }
        } catch (err) {
            setErrors({ otp: err.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    }

    const handleResetPassword = async () => {
        const newErrors = {};

        if (!password.newPassword) {
            newErrors.newPassword = 'Password is required.';
        } else if (password.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters.';
        }

        if (!password.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        }

        if (password.newPassword && password.confirmPassword && password.newPassword !== password.confirmPassword) {
            newErrors.matchPassword = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            const newPassword = password.newPassword;
            const response = await authApi.resetPassword({ email, newPassword });
            if (response) {
                alert("Reset password successful! You can now login with your new password.");
                onClose?.();
            }
        } catch (err) {
            setErrors({ resetPassword: err.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    }

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <div className="forgot-password-overlay" onClick={onClose}>
            <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
                {/* Decorative Watch Background */}
                <div className="modal-decoration">
                    <Icon icon="mdi:watch" className="watch-icon watch-icon-1" />
                    <Icon icon="mdi:watch-variant" className="watch-icon watch-icon-2" />
                    <Icon icon="mdi:clock-outline" className="watch-icon watch-icon-3" />
                </div>

                {/* Progress Steps */}
                <div className="forgot-password-modal__progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="progress-step__circle">
                            {step > 1 ? <Icon icon="mdi:check" width="20" height="20" /> : <Icon icon="mdi:email" width="20" height="20" />}
                        </div>
                        <span className="progress-step__label">Verify Email</span>
                    </div>
                    <div className={`progress-step__line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="progress-step__circle">
                            {step > 2 ? <Icon icon="mdi:check" width="20" height="20" /> : <Icon icon="mdi:shield-key" width="20" height="20" />}
                        </div>
                        <span className="progress-step__label">Enter OTP</span>
                    </div>
                    <div className={`progress-step__line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="progress-step__circle">
                            <Icon icon="mdi:lock-reset" width="20" height="20" />
                        </div>
                        <span className="progress-step__label">New Password</span>
                    </div>
                </div>
                <div className="forgot-password-modal__content">

                    {/* Header with Icons */}
                    <div className="forgot-password-modal__header">

                        <h2 className="forgot-password-modal__title">
                            {step === 1 && 'Forgot Your Password?'}
                            {step === 2 && 'Verify Your Identity'}
                            {step === 3 && 'Create New Password'}
                        </h2>
                        <p className="forgot-password-modal__subtitle">
                            {step === 1 && "Don't worry! It happens to the best of us. Let's get you back to shopping for luxury watches."}
                            {step === 2 && "We've sent a 6-digit verification code to your email. Please check your inbox (and spam folder)."}
                            {step === 3 && "Almost done! Create a strong password to secure your account and protect your watch collection."}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="forgot-password-modal__body">
                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <>
                                <div className="step-info">
                                    <div className="step-info-title">
                                        <Icon icon="mdi:information" width="18" height="18" />
                                        <strong>What happens next?</strong>
                                    </div>
                                    <p className='step-info-subtitle'>We'll send a verification code to your email address to confirm your identity.</p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" >
                                        <Icon icon="mdi:email-outline" width="18" height="18" />
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        ref={emailRef}
                                        value={email}
                                        onChange={(e) => {
                                            setErrors({});
                                            setEmail(e.target.value);
                                        }}
                                        placeholder="your.email@example.com"
                                        className={`${errors.email ? 'error' : ''}`}
                                        disabled={loading}
                                        autoComplete="on"
                                    />
                                    {errors.email && (
                                        <div className="form-error">
                                            <Icon icon="mdi:alert-circle" width="15" height="15" />
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="step-info">
                                    <div className="step-info-title">
                                        <Icon icon="mdi:help-circle" width="18" height="18" />
                                        <strong>Need help?</strong>
                                    </div>
                                    <p className='step-info-subtitle'>Can't access your email? <Link to="#" className='link'>Contact our support team</Link></p>
                                </div>
                            </>

                        )}

                        {/* Step 2: OTP Input */}
                        {step === 2 && (
                            <>
                                <div className="step-info">
                                    <div className="step-info-title">
                                        <Icon icon="mdi:email-check" width="18" height="18" />
                                        <strong>Check your email!</strong>
                                    </div>
                                    <p className='step-info-subtitle'>We sent a code to <strong>{email}</strong></p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="otp" >
                                        <Icon icon="mdi:lock-check-outline" width="18" height="18" />
                                        Verification Code
                                    </label>
                                    <div className="otp-input-container">
                                        <input
                                            type="text"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => {
                                                setErrors({});
                                                const value = e.target.value.replace(/\D/g, '');
                                                setOTP(value);
                                            }}
                                            placeholder="000000"
                                            maxLength="6"
                                            className={` ${errors.otp ? 'error' : ''}`}
                                            disabled={loading}
                                            autoComplete="one-time-code"
                                        />
                                        <div className="otp-timer">
                                            <Icon icon="mdi:timer-sand" width="15" height="15" />
                                            <span>{countdown > 0 ? `${countdown}s` : 'Expired'}</span>
                                        </div>
                                    </div>
                                    {errors.otp && (
                                        <div className="form-error">
                                            <Icon icon="mdi:alert-circle" width="15" height="15" />
                                            <span>{errors.otp}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="resend-section">
                                    <p className="resend-title">Didn't receive the code?</p>
                                    {countdown > 0 ? (
                                        <span className="resend-disabled">
                                            Resend available in {countdown}s
                                        </span>
                                    ) : (
                                        <button
                                            className="resend-button"
                                            onClick={handleSendEmail}
                                            disabled={loading}
                                        >
                                            <Icon icon="mdi:refresh" width="18" height="18" />
                                            Resend Code
                                        </button>
                                    )}
                                </div>

                                <div className="step-info-subtitle">
                                    <Icon icon="mdi:shield-check" width="18" height="18" />
                                    <span>Your security is our priority. The code expires in 15 minutes.</span>
                                </div>
                            </>
                        )}

                        {/* Step 3: Password Reset */}
                        {step === 3 && (
                            <>
                                <div className="step-info">
                                    <div className="step-info-title">
                                        <Icon icon="mdi:check-circle" width="18" height="18" />
                                        <strong>Identity Verified!</strong>
                                    </div>
                                    <p className='step-info-subtitle'>Now create a strong password to protect your luxury watch collection.</p>
                                </div>

                                <div className='form-groups'>
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="newPassword" className="form-label">
                                                <Icon icon="mdi:lock-outline" width="20" height="20" />
                                                New Password
                                            </label>
                                            <div className="form-input-wrapper">
                                                <input
                                                    type={showPasswords.newPassword ? "text" : "password"}
                                                    id="newPassword"
                                                    value={password.newPassword || ''}
                                                    onChange={(e) => {
                                                        setPassword({ ...password, newPassword: e.target.value });
                                                        setErrors({});
                                                    }}
                                                    placeholder="Enter new password"
                                                    className={`form-input form-input--with-icon ${errors.newPassword ? 'form-input--error' : ''}`}
                                                    disabled={loading}
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="form-input-toggle"
                                                    onClick={() => toggleVisibility('newPassword')}
                                                    disabled={loading}
                                                >
                                                    <Icon
                                                        icon={showPasswords.newPassword ? "mdi:eye" : "mdi:eye-off"}
                                                        width="20"
                                                        height="20"
                                                    />
                                                </button>
                                            </div>
                                            {errors.newPassword && (
                                                <div className="form-error">
                                                    <Icon icon="mdi:alert-circle" width="15" height="15" />
                                                    <span>{errors.newPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                <Icon icon="mdi:lock-check-outline" width="20" height="20" />
                                                Confirm Password
                                            </label>
                                            <div className="form-input-wrapper">
                                                <input
                                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    value={password.confirmPassword || ''}
                                                    onChange={(e) => {
                                                        setPassword({ ...password, confirmPassword: e.target.value });
                                                        setErrors({});
                                                    }}
                                                    placeholder="Confirm new password"
                                                    className={`form-input form-input--with-icon ${errors.confirmPassword || errors.matchPassword ? 'form-input--error' : ''}`}
                                                    disabled={loading}
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="form-input-toggle"
                                                    onClick={() => toggleVisibility('confirmPassword')}
                                                    disabled={loading}
                                                >
                                                    <Icon
                                                        icon={showPasswords.confirmPassword ? "mdi:eye" : "mdi:eye-off"}
                                                        width="20"
                                                        height="20"
                                                    />
                                                </button>
                                            </div>
                                            {(errors.confirmPassword || errors.matchPassword) && (
                                                <div className="form-error">
                                                    <Icon icon="mdi:alert-circle" width="15" height="15" />
                                                    <span>{errors.confirmPassword || errors.matchPassword}</span>
                                                </div>
                                            )}
                                            {errors.resetPassword && (
                                                <div className="form-error">
                                                    <Icon icon="mdi:alert-circle" width="15" height="15" />
                                                    <span>{errors.resetPassword}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="password-requirements">
                                        <div className="requirements-title">
                                            <Icon icon="mdi:shield-check" width="18" height="18" />
                                            Password Requirements:
                                        </div>
                                        <div className="requirements-list">
                                            <div className={`requirement-item ${password.newPassword?.length >= 8 ? 'met' : ''}`}>
                                                <Icon icon={password.newPassword?.length >= 8 ? "mdi:check-circle" : "mdi:circle-outline"} width="15" height="15" />
                                                <span>At least 8 characters</span>
                                            </div>
                                            <div className={`requirement-item ${/[A-Z]/.test(password.newPassword) ? 'met' : ''}`}>
                                                <Icon icon={/[A-Z]/.test(password.newPassword) ? "mdi:check-circle" : "mdi:circle-outline"} width="15" height="15" />
                                                <span>One uppercase letter</span>
                                            </div>
                                            <div className={`requirement-item ${/[a-z]/.test(password.newPassword||"") ? 'met' : ''}`}>
                                                <Icon icon={/[a-z]/.test(password.newPassword||"") ? "mdi:check-circle" : "mdi:circle-outline"} width="15" height="15" />
                                                <span>One lowercase letter</span>
                                            </div>
                                            <div className={`requirement-item ${/[0-9]/.test(password.newPassword) ? 'met' : ''}`}>
                                                <Icon icon={/[0-9]/.test(password.newPassword) ? "mdi:check-circle" : "mdi:circle-outline"} width="15" height="15" />
                                                <span>One number</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="forgot-password-modal__footer">
                        <button
                            className="forgot-password-modal__button forgot-password-modal__button--secondary"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <Icon icon="mdi:arrow-left" width="20" height="20" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            className="forgot-password-modal__button forgot-password-modal__button--primary"
                            onClick={handleMultipleButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Icon icon="svg-spinners:ring-resize" width="20" height="20" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {step === 1 && 'Send Verification Code'}
                                    {step === 2 && 'Verify Code'}
                                    {step === 3 && 'Reset Password'}
                                    <Icon icon="mdi:arrow-right" width="20" height="20" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="modal-trust">
                        <div className="trust-item">
                            <Icon icon="mdi:shield-lock" width="15" height="15" />
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="trust-item">
                            <Icon icon="mdi:clock-fast" width="15" height="15" />
                            <span>Fast Recovery</span>
                        </div>
                        <div className="trust-item">
                            <Icon icon="mdi:account-check" width="15" height="15" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}