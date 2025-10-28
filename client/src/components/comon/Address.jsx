import { useEffect, useState } from "react";
import { isValidPhoneNumber } from "../../utils/isValidPhoneNumber";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import addressApi from "../../api/addressApi";
import "../../styles/Address.css";

export default function Address({ onClose, onChange, addressData }) {
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    type: "Home",
  });

  useEffect(() => {
    if (addressData) {
      setAddress({
        name: addressData.name,
        phone: addressData.phone,
        address: addressData.address,
        type: addressData.type,
        id: addressData._id
      })
    }
  }, [addressData]);

  const checkValidForm = ()=>{
     if (!address.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Please enter full name." }));
      return false;
    }

    if (!address.phone) {
      setErrors((prev) => ({ ...prev, phone: "Please enter your phone number." }));
      return false;
    }

    if (!isValidPhoneNumber(address.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Invalid phone number format." }));
      return false;
    }

    if (!address.address.trim()) {
      setErrors((prev) => ({ ...prev, address: "Please enter address." }));
      return false;
    }
    return true;
  }
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePostAddress = async (e) => {
    e.preventDefault();
    if(!checkValidForm()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await addressApi.postAddress(address);
      toast.success(response.message);
      onClose?.();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePutAddress = async (e) => {
    e.preventDefault();

    if(!checkValidForm()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await addressApi.putAddress(address);
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
    <div className="address-container">
      <div className="address-card">
        <h2 className="address-title">Address Information</h2>

        <div className="address-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-adderss"
              value={address.name}
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
              className="input-adderss"
              value={address.phone}
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
              className="input-adderss"
              value={address.address}
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
              checked={address.type === "Home"}
              onChange={handleChange}
            />
            Home
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="Office"
              checked={address.type === "Office"}
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
          ) : addressData ? (
            <button className="btn-submit" disabled={loading} onClick={handlePutAddress}>
              <span>Save address</span>
            </button>
          ) : (
            <button className="btn-submit" disabled={loading} onClick={handlePostAddress}>
              <span>Save new address</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
