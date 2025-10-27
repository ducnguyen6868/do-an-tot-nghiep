import { useState, useEffect } from 'react';
import '../styles/AddressPage.css';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import Recipient from "../components/comon/Recipient";
import recipientApi from '../api/recipientApi';

export default function AddressPage() {
    const [addresses, setAddresses] = useState([]);
    const [recipientData, setRecipientData] = useState({});

    const recipients = async () => {
        try {
            const response = await recipientApi.recipient();
            setAddresses(response.recipients);
        } catch (err) {
            toast.error(err.respone?.data?.messaage || err.message);
        }
    }
    useEffect(() => {
        recipients();
    }, []);
    const [modal, setModal] = useState(false);
    const [recipientId, setRecipientId] = useState('');
    const [del, setDel] = useState(false);
    const [edit, setEdit] = useState(false);

    const handleDelete = (recipientId) => {
        setRecipientId(recipientId);
        setDel(true);
    }
    const confirmDelete = async () => {
        try {
            const response = await recipientApi.delete(recipientId);
            await recipients();
            setDel(false);
            toast.success(response.message);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }

    const handleSetDefault = async (recipientId) => {
        setRecipientId(recipientId);
        try {
            const response = await recipientApi.setDefault(recipientId);
            await recipients();
            toast.success(response.messaage);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }

    const handleEdit = (address) => {
        setRecipientData(address);
        setEdit(true);
    }
    return (
        <>
            {/* Addresses */}
            <div className="tab-content">
                <div className="content-header">
                    <h2 className="content-title-address">Delivery Addresses</h2>
                    <button className="add-new-btn" onClick={() => setModal(true)}>+ Add New Address</button>
                </div>
                <div className="addresses-container">
                    {addresses.map(address => (
                        <div key={address._id} className="address-item">
                            <div className="address-header">
                                <div className="address-type-badge">{address.type}</div>
                                {address.isDefault && <div className="default-tag">Default</div>}
                            </div>
                            <div className="address-content">
                                <div className="address-name">{address.name}</div>
                                <div className="address-phone">{address.phone}</div>
                                <div className="address-text">
                                    {address.address}
                                </div>
                            </div>
                            <div className="address-footer">
                                <button className="address-btn" onClick={() => handleEdit(address)}>Edit</button>
                                <button className="address-btn danger" onClick={() => handleDelete(address._id)}>Delete</button>
                                {!address.isDefault && (
                                    <button className="address-btn" onClick={() => handleSetDefault(address._id)}>Set Default</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {modal && (
                <div className='modal-overlay' onClick={() => setModal(false)}>
                    <div className='modal-contents' onClick={(e) => e.stopPropagation()}>
                        {<Recipient onClose={() => setModal(false)} onChange={() => recipients()} />}
                    </div>
                </div>
            )}
            {del && (
                <div className="modal-overlay" onClick={() => setDel(false)}>
                    <div className="modal-content logout-modal-content " onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal">
                            <Icon icon="noto:waving-hand" width="50" height="50" />

                            <h3 className="logout-title" style={{ animation: 'none' }}>Confirm delete</h3>
                            <p className="logout-message">Are you sure you want to delete this recipient ?</p>

                            <div className="logout-actions">
                                <button className="logout-cancel-btn" onClick={() => setDel(false)}>
                                    Cancel
                                </button>
                                <button className="logout-confirm-btn" onClick={confirmDelete}>
                                    <span>Yes</span>
                                    <span className="logout-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {edit && (
                <div className="modal-overlay" onClick={() => setEdit(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Recipient onClose={() => setEdit(false)} onChange={() => recipients()} recipientData={recipientData} />
                    </div>
                </div>
            )}
        </>
    )
}