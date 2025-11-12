import axiosClient from './axiosClient';

const productApi = {
    getProducts: (page,limit) => axiosClient.get(`/product?page=${page}&&limit=${limit}`),
    search: (keyword) => axiosClient.get(`/product/search?keyword=${keyword}`),
    detail: (code) => axiosClient.get(`/product/detail?code=${code}`),
    deleteProduct:(productId)=>axiosClient.delete(`/product/delete/${productId}`),
    wishlist: (wishlist) => axiosClient.post('product/wishlist', wishlist),
    getTrending: (page, limit) => axiosClient.get(`/product/trending?page=${page}&&limit=${limit}`),
    getVibeFinder: (cateId) => axiosClient.get(`/product/category/${cateId}`),
    getFlashsale: (page, limit) => axiosClient.get(`/product/flashsale?page=${page}&&limit=${limit}`),
    patchStock:(productId,index,stock)=>axiosClient.patch(`/product/stock/update?productId=${productId}&&index=${index}&&stock=${stock}`),

}
export default productApi;