import axiosClient from "./axiosClient";

const pointApi = {
    patch:(userId)=>axiosClient.patch('/point',{userId})
}

export default pointApi;