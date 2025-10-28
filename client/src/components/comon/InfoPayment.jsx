import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import profileApi from "../../api/profileApi";
import momoImg from '../../assets/momo.png';
import zaloImg from '../../assets/zalopay.png';

export default function InfoPayment({ total , onSubmit }) {

    const [step, setStep] = useState(1);
    const [logged, setLogged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [infoPayment, setInfoPayment] = useState({
        name: '',
        phone: '',
        address: '',
        type: 'Home',
        payment: 'MOMO'
    });
    const [showAddress, setShowAddress] = useState(false);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const checkLogged = async () => {
            try {
                const response = await profileApi.profile();
                setLogged(true);
                setAddresses(response.addresses);
                setInfoPayment(prev=>({...prev , userId:response.user._id}));
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        checkLogged();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfoPayment(prev => ({ ...prev, [name]: value }));
    }


    const handleChangeAddress = (add) => {
        setInfoPayment(prev => ({
            ...prev,
            name: add.name,
            phone: add.phone,
            address: add.address,
            type: add.type,
        }));
        setShowAddress(false);
    };

    const handleSubmitOrder = () => {
        setLoading(true);
        if (infoPayment.name === '') {
            setErrors(prev => ({...prev, name: 'Please enter your name.' }));
            setStep(1);
            return;
        }
        if (infoPayment.phone === '') {
            setErrors(prev => ({ ...prev, phone: 'Please enter your phone.' }));
            setStep(1);
            return;
        }
        if (infoPayment.address === '') {
            setErrors(prev => ({ ...prev, address: 'Please enter your address.' }));
            setStep(1);
            return;
        }
        onSubmit?.(infoPayment);

    }
    return (
        <>
            {/* --- FORM --- */}
            <div className="checkout-form">
                <div className="step-indicator">
                    {['Shipping', 'Payment', 'Review'].map((label, i) => (
                        <div
                            key={label}
                            className={`step ${step === i + 1 ? 'active' : ''}`}
                            onClick={() => setStep(i + 1)}
                        >
                            <div className="step-number">{i + 1}</div>
                            <div>{label}</div>
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="form-order-section">
                        <div className="section-title">Shipping Address</div>
                        <div className="recipient-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={infoPayment.name}
                                    onChange={handleInputChange}
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
                                    value={infoPayment.phone}
                                    onChange={handleInputChange}
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
                                    value={infoPayment.address}
                                    onChange={handleInputChange}
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
                                    checked={infoPayment.type === "Home"}
                                    onChange={handleInputChange}
                                />
                                Home
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Office"
                                    checked={infoPayment.type === "Office"}
                                    onChange={handleInputChange}
                                />
                                Office
                            </label>
                            {logged && (<button className='forgot-btn' onClick={()=>setShowAddress(true)}>Use existing address ?</button>)}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-order-section">
                        <div className="section-title">Payment Method</div>
                        <div className="payment-method">
                            <label className="momo">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="MOMO"
                                    checked={infoPayment.payment === 'MOMO'}
                                    onChange={handleInputChange}
                                />
                                <img src={momoImg} alt="MOMO" />
                                <span className="payment-text">Pay with MOMO</span>
                            </label>
                            <label className="zalopay">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="ZaloPay"
                                    checked={infoPayment.payment === 'ZaloPay'}
                                    onChange={handleInputChange}
                                />
                                <img src={zaloImg} alt="zalopay" />
                                <span className="payment-text">Pay with ZaloPay</span>
                            </label>
                            <label className="cod">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={infoPayment.payment === 'COD'}
                                    onChange={handleInputChange}
                                />
                                <Icon icon="mdi:cash" width="30" height="30" />
                                <span className="payment-text">Cash On Delivery</span>
                            </label>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-order-section">
                        <div className="section-title">Order Review</div>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <p><strong>Ship to:</strong> {infoPayment.name} - {infoPayment.phone}</p>
                            <p>{infoPayment.address}</p>
                            <p><strong>Payment:</strong> {infoPayment.payment}</p>
                            <p><strong>Total:</strong> ${total}</p>
                        </div>
                    </div>
                )}

                <div className="buttons">
                    {step > 1 && (
                        <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                            Back
                        </button>
                    )}
                    {step < 3 && (
                        <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                            Continue to {step === 1 ? 'Payment' : 'Review'}
                        </button>
                    )}
                    {step === 3 && (
                        <button className="btn btn-primary" onClick={()=>handleSubmitOrder()} disabled={loading}>
                            {loading ? 'Processing...' : 'Complete Order'}
                        </button>
                    )}
                </div>
            </div>

            {/* --- MODAL --- */}
            {showAddress && (
                <div className="modal-overlay" style={{paddingTop:'10vh',alignItems:'flex-start'}} onClick={() => setShowAddress(false)}>
                    <div className="modal-content" style={{padding:'0'}} onClick={(e) => e.stopPropagation()}>
                        <div className="addresses-container" style={{width:'400px', display:'flex',flexDirection:'column'}}>
                            {addresses?.map((add) => (
                                <div
                                    key={add._id}
                                    className="address-item" onClick={() => handleChangeAddress(add)}
                                >
                                    <div className="address-header">
                                        <div className="address-type-badge">{add.type}</div>
                                        {add.isDefault && <div className="default-tag">Default</div>}
                                    </div>
                                    <div className="address-content">
                                        <div className="address-name">{add.name}</div>
                                        <div className="address-phone">{add.phone}</div>
                                        <div className="address-text">{add.address}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}