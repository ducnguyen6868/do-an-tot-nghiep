import { useState } from 'react';
import './PasswordChangeModal.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Icon } from "@iconify/react";

export default function PasswordChangeModal() {
  const [showModal, setShowModal] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
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

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
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

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (validateForm()) {

      try {
        const response = await axios.post("http://localhost:5000/profile/change-password", passwordData,
          {
            headers: {
              'Content-Type': `application/json`,
              'Authorization': `Bearer ${token}`
            }
          }
        )
        // console.log(response);
        if (response.data.status === "completed") {
          toast.success(response.data.message);
          setShowModal(false);
        }
      } catch (err) {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      }
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowModal(false)}>
          ✕
        </button>

        <div className="modal-header">
          <div className="header-icon">
            <Icon icon="noto:locked-with-key" width="50" height="50" />
          </div>
          <h2 className="modal-title">Change Password</h2>
          <p className="modal-subtitle">Create a strong password to keep your account secure</p>
        </div>

        <div className="modal-body">
          <div className="form-content">

            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  id="reset-password-toggle"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {
                    showPasswords.current ?
                      <Icon icon="noto:hear-no-evil-monkey" width="30" height="30" /> :
                      <Icon icon="noto:see-no-evil-monkey" width="30" height="30" />
                  }
                </button>
              </div>
              {errors.currentPassword && (
                <span className="error-message">{errors.currentPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  id="reset-password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {
                    showPasswords.new ?
                      <Icon icon="noto:hear-no-evil-monkey" width="30" height="30" /> :
                      <Icon icon="noto:see-no-evil-monkey" width="30" height="30" />
                  }
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}

              {passwordData.newPassword && (
                <div className="password-strength">
                  <div className="strength-bar-container">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${passwordStrength}%`,
                        background: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  id="reset-password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {
                    showPasswords.confirm ?
                      <Icon icon="noto:hear-no-evil-monkey" width="30" height="30" /> :
                      <Icon icon="noto:see-no-evil-monkey" width="30" height="30" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-requirements">
            <div className="password-requirements">
              <div className="requirements-title">Password should be contain:</div>
              <div className="requirements-list">
                <div className={`requirement-item ${passwordData.newPassword.length >= 8 ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordData.newPassword.length >= 8 ?
                      <Icon icon="noto:green-circle" width="14" height="14" />
                      :
                      <Icon icon="noto:white-circle" width="14" height="14" />
                    }
                  </span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`requirement-item ${passwordData.newPassword.match(/[A-Z]/) ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordData.newPassword.match(/[A-Z]/) ?
                      <Icon icon="noto:green-circle" width="14" height="14" />
                      :
                      <Icon icon="noto:white-circle" width="14" height="14" />
                    }
                  </span>
                  <span>One uppercase letter</span>
                </div>
                <div className={`requirement-item ${passwordData.newPassword.match(/[a-z]/) ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordData.newPassword.match(/[a-z]/) ?
                      <Icon icon="noto:green-circle" width="14" height="14" />
                      :
                      <Icon icon="noto:white-circle" width="14" height="14" />
                    }
                  </span>
                  <span>One lowercase letter</span>
                </div>
                <div className={`requirement-item ${passwordData.newPassword.match(/[0-9]/) ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordData.newPassword.match(/[0-9]/) ?
                      <Icon icon="noto:green-circle" width="14" height="14" />
                      :
                      <Icon icon="noto:white-circle" width="14" height="14" />
                    }
                  </span>
                  <span>One number</span>
                </div>
                <div className={`requirement-item ${passwordData.newPassword.match(/[^a-zA-Z0-9]/) ? 'met' : ''}`}>
                  <span className="requirement-icon">
                    {passwordData.newPassword.match(/[^a-zA-Z0-9]/) ?
                      <Icon icon="noto:green-circle" width="14" height="14" />
                      :
                      <Icon icon="noto:white-circle" width="14" height="14" />
                    }
                  </span>
                  <span>One special character</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}