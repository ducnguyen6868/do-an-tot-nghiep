import axiosClient from "./axiosClient";
const orderApi={
    view:()=>axiosClient.get('/order'),
    viewOrder:(orderId) =>axiosClient.get(`/order/${orderId}`),
    createOrder:(orderData,orderId ,fromCart) =>axiosClient.post('/order/create',{orderData,orderId ,fromCart}),
    payment:(final_amount) =>axiosClient.post('/order/payment',{final_amount}),
    transitionStatus:(orderId) =>axiosClient.post('/order/transition-status',{orderId}),
    orders:()=>axiosClient.get('/order/management'),
    changeStatus:(orderId ,status)=>axiosClient.patch('/order/status',{orderId ,status})
}
export default orderApi;