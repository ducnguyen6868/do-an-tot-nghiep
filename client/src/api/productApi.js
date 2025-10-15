import axiosClient from './axiosClient';

const productApi ={
    product:()=>axiosClient.get('/product'),
    search:(keyword)=>axiosClient.get(`/product/search?keyword=${keyword}`),
    detail:(code)=>axiosClient.get(`/product/detail?code=${code}`)
}
export default productApi;