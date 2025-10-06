import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        avatar: ''
    });
    const getInfoUser = async () => {

        const token = localStorage.getItem("token")||sessionStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:5000/profile", {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => setUserInfo({
                name: res.data.user.name,
                email: res.data.user.email,
                avatar: res.data.user.avatar
            })).catch(() => setUserInfo({
                name: '',
                email: '',
                avatar: ''
            }));
        }else{
            setUserInfo({
                name: '',
                email: '',
                avatar: ''
            });
        }
    }
    useEffect(() => {

        getInfoUser();
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                getInfoUser();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);

    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, getInfoUser }}>
            {children}
        </UserContext.Provider>
    );
};
