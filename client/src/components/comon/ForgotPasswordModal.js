import { useRef, useState } from 'react';
import './ForgotPasswordModal.css';
import { Icon } from '@iconify/react';
import axios from 'axios';
import LoadingAnimations from './LoadingAnimations';

export default function ForgotPasswordModal({ onClose }) {
    const emailRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowpasswords] = useState({
        newPassword: false,
        confirmPassword: false
    });

    const [step, setStep] = useState(3);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState({});

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const toggleVisibility = (key) => {
        setShowpasswords({
            ...showPasswords,
            [key]: !showPasswords[key]
        })
    }

    const handleBack = () => {
        if (isLoading) return;
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
            handleResetPassword()
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
        
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const response = await axios.post("http://localhost:5000/send-otp", { email }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                setErrors({});
                setStep(2);
            }
        } catch (err) {
            setErrors({ email: err.response?.data?.message || err.message });
        } finally {
            setIsLoading(false);
        }
    }

    const handleVirifyOTP = async () => {
        if (otp === '') {
            setErrors({ otp: "OTP is required." });
            return;
        }
        
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        try {
            const response = await axios.post("http://localhost:5000/verify-otp", { email, otp }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                setErrors({});
                setStep(3);
            }
        } catch (err) {
            setErrors({ otp: err.response?.data?.message || err.message });
        } finally {
            setIsLoading(false);
        }
    }

    const handleResetPassword = async () => {
        const newErrors = {};

        if (!password.newPassword) {
            newErrors.newPassword = 'Password is required.';
        }

        if (!password.confirmPassword) {
            newErrors.confirmPassword = 'Please enter your confirm password.';
        }

        if (password.newPassword && password.confirmPassword && password.newPassword !== password.confirmPassword) {
            newErrors.matchPassword = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            const newPassword = password.newPassword;
            const response = await axios.post("http://localhost:5000/reset-password", { email, newPassword }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                alert("Reset password successful");
                onClose?.();
            }
        } catch (err) {
            setErrors({ resetPassword: err.response?.data?.message || err.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="forgot-password-overlay" onClick={onClose}>
            <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="forgot-password-modal__close" onClick={onClose}>
                    <Icon icon="mdi:close" width="24" height="24" />
                </button>

                {/* Progress Steps */}
                <div className="forgot-password-modal__progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="progress-step__circle">
                            {step > 1 ? <Icon icon="mdi:check" width="20" height="20" /> : '1'}
                        </div>
                        <span className="progress-step__label">Email</span>
                    </div>
                    <div className={`progress-step__line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="progress-step__circle">
                            {step > 2 ? <Icon icon="mdi:check" width="20" height="20" /> : '2'}
                        </div>
                        <span className="progress-step__label">Verify</span>
                    </div>
                    <div className={`progress-step__line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="progress-step__circle">3</div>
                        <span className="progress-step__label">Reset</span>
                    </div>
                </div>

                {/* Header */}
                <div className="forgot-password-modal__header">
                    <h2 className="forgot-password-modal__title">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                        <Icon 
                            icon={step === 1 ? "noto:thinking-face" : step === 2 ? "noto:key" : "noto:locked-with-key"} 
                            width="36" 
                            height="36" 
                        />
                    </h2>
                    <p className="forgot-password-modal__subtitle">
                        {step === 1 && 'Enter your email to receive OTP'}
                        {step === 2 && 'Enter the 6-digit code sent to your email'}
                        {step === 3 && 'Create a new password for your account'}
                        <Icon icon="noto:smiling-face-with-hearts" width="18" height="18" />
                    </p>
                </div>

                {/* Body */}
                <div className="forgot-password-modal__body">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="form-step form-step--active">
                            <div className="form-group-forgot">
                                <label htmlFor="email" className="form-label">
                                    <Icon icon="mdi:email" width="20" height="20" />
                                    Email Address
                                </label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        ref={emailRef}
                                        value={email}
                                        onChange={(e) => {
                                            setErrors({});
                                            setEmail(e.target.value);
                                        }}
                                        placeholder="your@email.com"
                                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>
                            {isLoading && (
                                <div className="form-loading">
                                    <LoadingAnimations option="spinner" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: OTP Input */}
                    {step === 2 && (
                        <div className="form-step form-step--active">
                            <div className="form-group-forgot">
                                <label htmlFor="otp" className="form-label">
                                    <Icon icon="mdi:lock-check" width="20" height="20" />
                                    OTP Code
                                </label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => {
                                            setErrors({});
                                            setOTP(e.target.value.replace(/\D/g, ''));
                                        }}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        className={`form-input form-input--otp ${errors.otp ? 'form-input--error' : ''}`}
                                        disabled={isLoading}
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                {errors.otp && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.otp}</span>
                                    </div>
                                )}
                                <button className="form-link" onClick={handleSendEmail}>
                                    Resend OTP
                                </button>
                            </div>
                            {isLoading && (
                                <div className="form-loading">
                                    <LoadingAnimations option="spinner" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Password Reset */}
                    {step === 3 && (
                        <div className="form-step form-step--active">
                            <div className="form-group-forgot">
                                <label htmlFor="newPassword" className="form-label">
                                    <Icon icon="mdi:lock" width="20" height="20" />
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
                                        placeholder="••••••••"
                                        className={`form-input ${errors.newPassword ? 'form-input--error' : ''}`}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="form-input-toggle"
                                        onClick={() => toggleVisibility('newPassword')}
                                        disabled={isLoading}
                                    >
                                        <Icon 
                                            icon={showPasswords.newPassword ? "noto:hear-no-evil-monkey" : "noto:see-no-evil-monkey"} 
                                            width="24" 
                                            height="24" 
                                        />
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.newPassword}</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group-forgot">
                                <label htmlFor="confirmPassword" className="form-label">
                                    <Icon icon="mdi:lock-check" width="20" height="20" />
                                    Confirm New Password
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
                                        placeholder="••••••••"
                                        className={`form-input ${errors.confirmPassword || errors.matchPassword ? 'form-input--error' : ''}`}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="form-input-toggle"
                                        onClick={() => toggleVisibility('confirmPassword')}
                                        disabled={isLoading}
                                    >
                                        <Icon 
                                            icon={showPasswords.confirmPassword ? "noto:hear-no-evil-monkey" : "noto:see-no-evil-monkey"} 
                                            width="24" 
                                            height="24" 
                                        />
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.confirmPassword}</span>
                                    </div>
                                )}
                                {errors.matchPassword && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.matchPassword}</span>
                                    </div>
                                )}
                                {errors.resetPassword && (
                                    <div className="form-error">
                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                        <span>{errors.resetPassword}</span>
                                    </div>
                                )}
                            </div>

                            {isLoading && (
                                <div className="form-loading">
                                    <LoadingAnimations option="spinner" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="forgot-password-modal__footer">
                    <button 
                        className="forgot-password-modal__button forgot-password-modal__button--secondary"
                        onClick={handleBack}
                        disabled={isLoading}
                    >
                        <Icon icon="mdi:arrow-left" width="20" height="20" />
                        Back
                    </button>
                    <button 
                        className="forgot-password-modal__button forgot-password-modal__button--primary"
                        onClick={handleMultipleButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Icon icon="mdi:loading" className="spinning" width="20" height="20" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {step === 1 && 'Send OTP'}
                                {step === 2 && 'Verify OTP'}
                                {step === 3 && 'Reset Password'}
                                <Icon icon="mdi:arrow-right" width="20" height="20" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}