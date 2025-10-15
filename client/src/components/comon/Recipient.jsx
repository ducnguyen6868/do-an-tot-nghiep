import { useEffect, useState } from "react";
import "../../styles/Recipient.css";
import { isValidPhoneNumber } from "../../utils/isValidPhoneNumber";
import recipientApi from "../../api/recipientApi";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

export default function Recipient({ onClose, onChange, recipientData }) {
  const [loading, setLoading] = useState(false);

  const [recipient, setRecipient] = useState({
    name: "",
    phone: "",
    address: "",
    type: "Home",
  });

  useEffect(() => {
    if (recipientData) {
      setRecipient({
        name: recipientData.name,
        phone: recipientData.phone,
        address: recipientData.address,
        type: recipientData.type,
        id:recipientData._id
      })
    }
  }, []);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipient((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddRecipient = async (e) => {
    e.preventDefault();

    if (!recipient.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Please enter full name." }));
      return;
    }

    if (!recipient.phone) {
      setErrors((prev) => ({ ...prev, phone: "Please enter your phone number." }));
      return;
    }

    if (!isValidPhoneNumber(recipient.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Invalid phone number format." }));
      return;
    }

    if (!recipient.address.trim()) {
      setErrors((prev) => ({ ...prev, address: "Please enter address." }));
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await recipientApi.addRecipient(recipient);
      toast.success(response.message);
      onClose?.();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecipient = async (e) => {
    e.preventDefault();

    if (!recipient.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Please enter full name." }));
      return;
    }

    if (!recipient.phone) {
      setErrors((prev) => ({ ...prev, phone: "Please enter your phone number." }));
      return;
    }

    if (!isValidPhoneNumber(recipient.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Invalid phone number format." }));
      return;
    }

    if (!recipient.address.trim()) {
      setErrors((prev) => ({ ...prev, address: "Please enter address." }));
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await recipientApi.editRecipient(recipient);
      toast.success(response.message);
      onClose?.();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipient-container">
      <div className="recipient-card">
        <h2 className="recipient-title">Recipient Information</h2>

        <div className="recipient-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipient.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <div className="form-error">
                <Icon icon="mdi:alert-circle" width="16" height="16" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={recipient.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <div className="form-error">
                <Icon icon="mdi:alert-circle" width="16" height="16" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={recipient.address}
              onChange={handleChange}
              required
            />
            {errors.address && (
              <div className="form-error">
                <Icon icon="mdi:alert-circle" width="16" height="16" />
                <span>{errors.address}</span>
              </div>
            )}
          </div>

          <label>
            <input
              type="radio"
              name="type"
              value="Home"
              checked={recipient.type === "Home"}
              onChange={handleChange}
            />
            Home
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="Office"
              checked={recipient.type === "Office"}
              onChange={handleChange}
            />
            Office
          </label>

          {loading ? (
            <>
              <button className="btn-submit" disabled={loading}>
                <Icon icon="svg-spinners:ring-resize" width="20" height="20" />
                Processing...
              </button>
            </>
          ) : recipientData ? (
            <button className="btn-submit" disabled={loading} onClick={handleEditRecipient}>
              <span>Save Recipient</span>
            </button>
          ) : (
            <button className="btn-submit" disabled={loading} onClick={handleAddRecipient}>
              <span>Save Recipient</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
