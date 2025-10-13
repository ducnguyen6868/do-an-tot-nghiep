import axiosClient from './axiosClient';

const productApi ={
    product:()=>axiosClient.get('/product'),
    search:(keyword)=>axiosClient.get(`/product/search?keyword=${keyword}`),
}
export default productApi;