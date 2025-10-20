import axiosClient  from './axiosClient';

const userApi= {
    changePassword:(passwords)=>axiosClient.post('/profile/change-password',passwords),
    viewCart:()=>axiosClient.get('/view-cart'),
    addCart:(data)=>axiosClient.patch('/add-to-cart',{data}),
    deleteCart:(cartId)=>axiosClient.delete(`/cart/${cartId}`),
    changeQuantity:(cartId,quantity) =>axiosClient.patch('/cart/change-quantity',{cartId,quantity})
}
export default userApi;