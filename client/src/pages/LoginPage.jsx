import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import "../styles/LoginPage.css";
import { isValidEmail } from '../utils/isValidEmail';
import ForgotPasswordModal from '../components/comon/ForgotPasswordModal';
import authApi from '../api/authApi';

export default function LoginPage() {

  const { setInfoUser } = useContext(UserContext);

  const [isModal, setIsModal] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email:'',
    password: '',
    rememberMe: true,
  });

  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [errors, setErrors] = useState({});


  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({...errors ,[name]:''});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email) newErrors.email = 'Email is required';
    if (!(isValidEmail(loginData.email))) newErrors.email = 'Email format isn`t correct';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // API login
    try {
      const response = await authApi.login(loginData);
      if (loginData.rememberMe) {
        //Save token to localstorage 
        localStorage.setItem("token", response.token);
      } else {
        sessionStorage.setItem("token", response.token);
      }
      toast.success(response.message);
      await setInfoUser(prev=>({
        ...prev , name:response.user.name,
        email:response.user.email,
        avatar:response.user.avatar,
        cart:response.user.carts?.length,
        wishlist:response.user.wishlist?.length
      }));
      navigate('/');

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <div className="login-section">
        <div className="login-container">
          <div className="login-header">
            <h2 className="form-title">Welcome back !</h2>
            <p className="form-subtitle">Get ready for hundreds of hot deals and exciting discounts!</p>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="input-label" htmlFor="email">
              <Icon icon="mdi:email-outline" width="18" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="your@email.com"
              autoComplete='on'
              className={errors.email ? "error" : ""}

            />
            {errors.email && (
              <div className="form-error">
                <Icon icon="mdi:alert-circle" width="16" height="16" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="input-label" htmlFor="password">
              <Icon icon="mdi:lock-outline" width="18" />
              <span>Password</span>
            </label>
            <div className="form-input">
              <input
                type={isHiddenPassword ? "password" : "text"}
                name="password"
                id="password"
                value={loginData.password}
                onChange={handleLoginChange}
                onKeyDown={(e)=>{
                  if(e.key==='Enter'){
                    handleLoginSubmit(e);
                  }
                }}
                placeholder="••••••••"
                autoComplete='current-password'
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
          {/* Checkboxes */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleLoginChange}
              />
              <span>
                Remember me
              </span>
            </label>
            <button className="forgot-btn" onClick={() => setIsModal(true)}>Forgot password ?</button>
          </div>

          {/* Submit */}
          <button className="submit-btn" onClick={handleLoginSubmit}>
            Login
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
            No account? <Link to="../register" className="link">Sign Up</Link>
          </p>
        </div>
      </div>
      {/* Forgot password modal */}
      {isModal && <ForgotPasswordModal onClose={() => setIsModal(false)} />}
    </>

  );
}
