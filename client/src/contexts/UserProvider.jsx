import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
export const UserProvider = ({ children }) => {

    const [infoUser, setInfoUser] = useState({
        name: '',
        email: '',
        avatar: ''
    });
    const getInfoUser = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem("token");
        if (!token) {
            setInfoUser({
                name: '',
                email: '',
                avatar: ''
            });
            return;
        }
        try {
            const response = await axios.get("http://localhost:5000/profile",{headers:{
                Authorization:`Bearer ${token}`
            }});
            setInfoUser({
                name: response.data.user.name,
                email: response.data.user.email,
                avatar: response.data.user.avatar
            })
        } catch (err) {
            setInfoUser({
                name: '',
                email: '',
                avatar: ''
            });
        }

    }
    useEffect(() => {
        getInfoUser();
    }, []);
    return (
        <>
            <UserContext.Provider value={{ infoUser, getInfoUser }}>
                {children}
            </UserContext.Provider>
        </>
    )


}