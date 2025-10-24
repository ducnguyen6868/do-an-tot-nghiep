import { useState } from 'react';
import '../styles/ProfilePage.css';
import { Icon } from '@iconify/react';
import PasswordChangeModal from '../components/comon/PasswordChangeModal';

export default function ProfilePage() {

    const [passwordChangeModal, setPasswordChangeModal] = useState(false);

    return (
        <div className="tab-content">
            <h2 className="content-title">Personal Information</h2>
            <div className="info-grid">
                <div className="info-card">
                    <div className="info-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 128 128" ><path fill="#0b2eb8ff" d="M115.1 120v4H12.9v-4c0-15.7 19.9-23.3 42-24.9V94c-9.3-2.8-17.6-9.8-21.7-21.3c-4.2-1.5-6.6-15.3-5.5-17.1C26.9 49.8 21.4 4.3 64 4c42.5.2 37.1 45.6 36.2 51.5c1.1 1.8-1.3 15.6-5.5 17.1c-4 11.5-12.3 18.6-21.6 21.4v1c22.2 1.8 42 10.2 42 25"></path></svg>
                    </div>
                    <div className="info-details">
                        <div className="info-label">Full Name</div>
                        <div className="info-value">John Doe</div>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="info-card">
                    <div className="info-icon">
                        <Icon icon="noto:incoming-envelope" width="30" height="30" />
                    </div>
                    <div className="info-details">
                        <div className="info-label">Email Address</div>
                        <div className="info-value">johndoe6868@icoloud.com</div>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="info-card">
                    <div className="info-icon">
                        <Icon icon="noto:mobile-phone" width="30" height="30" />
                    </div>
                    <div className="info-details">
                        <div className="info-label">Phone Number</div>
                        <div className="info-value">(+128) 264 68 68 68</div>
                    </div>
                    <button className="edit-btn">Edit</button>
                </div>
            </div>
            <div className="security-section">
                <h3 className="section-subtitle">
                    <span style={{ marginRight: "10px" }}>Security Settings</span>
                    <Icon icon="noto:gear" width="30" height="30" />
                </h3>
                <div className='security-box'>
                    <button className="action-button primary" onClick={() => setPasswordChangeModal(true)}>
                        <span style={{ marginRight: "10px" }}>Change Password</span>
                        <Icon icon="noto:key" width="24" height="24" />
                    </button>
                    <button className="action-button secondary">
                        <span style={{ marginRight: "10px" }}>Enable Two-Factor Authentication</span>
                        <Icon icon="noto:shield" width="24" height="24" />
                    </button>
                </div>
            </div>
            { passwordChangeModal && <PasswordChangeModal onClose={() => { setPasswordChangeModal(false) }} /> }
        </div>
    );

}