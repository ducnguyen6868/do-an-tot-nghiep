import axiosClient from "./axiosClient";

const recipientApi = {
    recipient:()=>axiosClient.get('/recipient'),
    addRecipient:(data)=>axiosClient.post('/recipient/add',{data}),
    delete:(recipientId)=>axiosClient.delete(`/recipient/${recipientId}`),
    setDefault:(recipientId)=>axiosClient.patch(`/recipient/setDefault/${recipientId}`),
    editRecipient:(recipient)=>axiosClient.put('/recipient/edit',{recipient})
}
export default recipientApi;