import axiosClient from "./axiosClient";
const profileApi = {
    profile: () => axiosClient.get('/profile')
}
export default profileApi;