import axiosClient from './axiosClient';

const productApi ={
    product:()=>axiosClient.get('/product'),
    search:(keyword)=>axiosClient.get(`/product/search?keyword=${keyword}`),
    detail:(code)=>axiosClient.get(`/product/detail?code=${code}`),
    wishlist:(wishlist)=>axiosClient.post('product/wishlist',wishlist)
}
export default productApi;