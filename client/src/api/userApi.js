import axiosClient  from './axiosClient';

const userApi= {
    changePassword:(passwords)=>axiosClient.post('/profile/change-password',passwords)
}
export default userApi;