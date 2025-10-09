require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds=parseInt(process.env.SALT_ROUNDS);
const transporter=require('../config/mail');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "Email does not exist" });
    }

    const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const otpHashed = await bcrypt.hash(String(otp), saltRounds);
    const timeExpired = Date.now() + 15 * 60 * 1000; 

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `<div style="font-family:Arial,sans-serif">
              <h2 style="color:#5eff00">Xác nhận đặt lại mật khẩu</h2>
              <p>Xin chào ${user.name},</p>
              <p>Mã OTP của bạn là:</p>
              <h3 style="font-size:24px;color:#ff0077">${otp}</h3>
              <p>Mã sẽ hết hạn sau <b>15 phút</b>.</p>
            </div>`
    });

    await User.findOneAndUpdate(
      { email },
      { $set: { resetPasswordOTP: otpHashed, resetPasswordOTPExpiry: timeExpired } }
    );

    return res.status(200).json({ message: "OTP sent successfully." });

  } catch (err) {
    return res.status(500).json({ message: "Server error: "+err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Account does not exist." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(403).json({ message: "OTP is incorrect." });
    }

    if (user.resetPasswordOTPExpiry < Date.now()) {
      return res.status(400).json({ status: "failed", message: "OTP has expired. Please request a new one." });
    }

    return res.status(200).json({
      message: "OTP verified successfully. You can set your new password now."
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email does not exist." });

    if (!user.resetPasswordOTP) {
      return res.status(400).json({ message: "No OTP found. Please request a new OTP." });
    }

    if (user.resetPasswordOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request again." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword, resetPasswordOTP: "", resetPasswordOTPExpiry: null } }
    );

    return res.status(200).json({ message: "Password reset successfully!" });

  } catch (err) {
    return res.status(500).json({ message: "Server error"+ err.message });
  }
};

module.exports = { forgotPassword, verifyOtp, resetPassword };
