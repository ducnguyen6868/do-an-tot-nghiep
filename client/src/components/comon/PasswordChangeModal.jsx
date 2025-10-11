import { useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from "@iconify/react";
import '../../styles/PasswordChangeModal.css';
import userApi from '../../api/userApi';

export default function PasswordChangeModal({ onClose }) {

  const [loading, setLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordsStrength] = useState(0);
  const [passwords, setPasswords] = useState({});

  const toggleVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });

    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }

    // Clear errors
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const calculatePasswordStrength = (passwords) => {
    let strength = 0;
    if (passwords.length >= 1) strength += 10;
    if (passwords.match(/[a-z]/) && passwords.match(/[A-Z]/)) strength += 25;
    if (passwords.match(/[0-9]/)) strength += 25;
    if (passwords.match(/[^a-zA-Z0-9]/)) strength += 25;
    if (passwords.length >= 8) strength += 15;
    setPasswordsStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#3b82f6';
    return '#10b981';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwords.currentPassword === passwords.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await userApi.changePassword(passwords);
        toast.success(response.message);

      } catch (err) {
        toast.error(err.response.data.message || err.message);

      } finally { 
        setLoading(false) ;
      }
    }
  };
  console.log(passwords.newPassword);
  return (
    <>
      <div className="forgot-password-overlay" >
        <div className="forgot-password-modal change-password-modal" >
          <div className="step-info ">
            <div className="step-info-title change-password-modal-title">
              <Icon icon="noto:locked-with-key" width="50" height="50" />
              <strong>Change Password</strong>
            </div>
            <p className='step-info-subtitle change-password-modal-subtitle'>Create a strong password to keep your account secure.</p>
          </div>

          <div className='form-groups'>
            <div>
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">
                  <Icon icon="mdi:lock-outline" width="20" height="20" />
                  Current password
                </label>
                <div className="form-input-wrapper">
                  <input
                    type={showPasswords.currentPassword ? "text" : "password"}
                    id="currentPassword"
                    name='currentPassword'
                    value={passwords.currentPassword || ''}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={`form-input form-input--with-icon ${errors.currentPassword ? 'form-input--error' : ''}`}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => toggleVisibility('currentPassword')}
                    disabled={loading}
                  >
                    <Icon
                      icon={showPasswords.currentPassword ? "mdi:eye" : "mdi:eye-off"}
                      width="20"
                      height="20"
                    />
                  </button>
                </div>
                {errors.currentPassword && (
                  <div className="form-error">
                    <Icon icon="mdi:alert-circle" width="16" height="16" />
                    <span>{errors.currentPassword}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  <Icon icon="mdi:lock-outline" width="20" height="20" />
                  New Password
                </label>
                <div className="form-input-wrapper">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwords.newPassword || ''}
                    onChange={handleInputChange}
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
                {passwords.newPassword && (
                  <div className='password-review'>
                    <div style={{ height: '2px', width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }}></div>
                    <span style={{ color: getStrengthColor(), fontSize: 'smaller' }}>{getStrengthText()}</span>
                  </div>
                )}
                {errors.newPassword && (
                  <div className="form-error">
                    <Icon icon="mdi:alert-circle" width="16" height="16" />
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
                    value={passwords.confirmPassword || ''}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={`form-input form-input--with-icon ${errors.confirmPassword || errors.matchPassword ? 'form-input--error' : ''}`}
                    disabled={loading}
                    autoComplete="new-password"
                    name="confirmPassword"
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
                    <Icon icon="mdi:alert-circle" width="16" height="16" />
                    <span>{errors.confirmPassword || errors.matchPassword}</span>
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
                <div className={`requirement-item ${passwords.newPassword?.length >= 8 ? 'met' : ''}`}>
                  <Icon icon={passwords.newPassword?.length >= 8 ? "mdi:check-circle" : "mdi:circle-outline"} width="16" height="16" />
                  <span>At least 8 characters</span>
                </div>
                <div className={`requirement-item ${/[A-Z]/.test(passwords.newPassword) ? 'met' : ''}`}>
                  <Icon icon={/[A-Z]/.test(passwords.newPassword) ? "mdi:check-circle" : "mdi:circle-outline"} width="16" height="16" />
                  <span>One uppercase letter</span>
                </div>
                <div className={`requirement-item ${/[a-z]/.test(passwords.newPassword||"") ? 'met' : ''}`}>
                  <Icon icon={/[a-z]/.test(passwords.newPassword||"") ? "mdi:check-circle" : "mdi:circle-outline"} width="16" height="16" />
                  <span>One lowercase letter</span>
                </div>
                <div className={`requirement-item ${/[0-9]/.test(passwords.newPassword) ? 'met' : ''}`}>
                  <Icon icon={/[0-9]/.test(passwords.newPassword) ? "mdi:check-circle" : "mdi:circle-outline"} width="16" height="16" />
                  <span>One number</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="forgot-password-modal__footer">
            <button
              className="forgot-password-modal__button forgot-password-modal__button--secondary"
              onClick={() => { onClose() }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="forgot-password-modal__button forgot-password-modal__button--primary"
              onClick={handleSubmit}
              disabled={loading}
            >{loading ? (
              <span>
                <Icon icon="svg-spinners:ring-resize" width="20" height="20" />
                Processing...
              </span>
            ) : (<span> Change password</span>)}

            </button>
          </div>
        </div>



      </div >


    </>
  );
}