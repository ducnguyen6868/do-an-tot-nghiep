import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import HeaderProfile from '../layout/HeaderProfile';
import SidebarProfile from '../layout/SidebarProfile';
export default function User() {
    const [activeTab , setActiveTab]= useState('profile');
    const location = useLocation();
    const currentActiveTab = location.state?.activeTab ||'profile';
    useEffect(()=>{
        setActiveTab(currentActiveTab);
    },[currentActiveTab]);
    return (
        <div className="user-page">
            <HeaderProfile />
            {/* Main Content */}
            <div className="main-section">
                {/* Sidebar Profile */}
                <SidebarProfile activeTab={activeTab} />
                {/* Content Area */}
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}