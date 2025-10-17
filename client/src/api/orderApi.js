import axiosClient from "./axiosClient";
const orderApi={
    createOrder:(orderData,orderId) =>axiosClient.post('/order/create',{orderData,orderId}),
    payment:(final_amount) =>axiosClient.post('/order/payment',{final_amount}),
    transitionStatus:(orderId) =>axiosClient.post('/order/transition-status',{orderId})
}
export default orderApi;