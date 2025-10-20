import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
export const UserProvider = ({ children }) => {

    const [infoUser, setInfoUser] = useState({
        name: '',
        email: '',
        avatar: '',
        wishlist:0,
        cart:0
    });
    const getInfoUser = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem("token");
        if (!token) {
            setInfoUser({
                name: '',
                email: '',
                avatar: '',
                wishlist:0,
                cart:0
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
                avatar: response.data.user.avatar,
                wishlist:response.data.user.wishlist?.length||0,
                cart:response.data.user.carts?.length||0
            })
        } catch (err) {
            setInfoUser({
                name: '',
                email: '',
                avatar: '',
                wishlist:0,
                cart:0
            });
        }

    }
    useEffect(() => {
        getInfoUser();
    }, []);
    return (
        <>
            <UserContext.Provider value={{ infoUser,setInfoUser, getInfoUser }}>
                {children}
            </UserContext.Provider>
        </>
    )


}