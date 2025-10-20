import axiosClient from "./axiosClient";
const orderApi={
    viewOrder:(orderId) =>axiosClient.post('/order',{orderId}),
    createOrder:(orderData,orderId ,fromCart) =>axiosClient.post('/order/create',{orderData,orderId ,fromCart}),
    payment:(final_amount) =>axiosClient.post('/order/payment',{final_amount}),
    transitionStatus:(orderId) =>axiosClient.post('/order/transition-status',{orderId})
}
export default orderApi;