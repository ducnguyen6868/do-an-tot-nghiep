import axiosClient from './axiosClient';

const productApi = {
    product: () => axiosClient.get('/product'),
    search: (keyword) => axiosClient.get(`/product/search?keyword=${keyword}`),
    detail: (code) => axiosClient.get(`/product/detail?code=${code}`),
    wishlist: (wishlist) => axiosClient.post('product/wishlist', wishlist),
    getTrending: (page, limit) => axiosClient.get(`/product/trending?page=${page}&&limit=${limit}`),
    getVibeFinder: (cateId) => axiosClient.get(`/product/category/${cateId}`),
    getFlashsale: (page, limit) => axiosClient.get(`/product/flashsale?page=${page}&&limit=${limit}`)

}
export default productApi;