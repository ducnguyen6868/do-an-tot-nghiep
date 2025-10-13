import axiosClient from "./axiosClient";

const brandApi = {
    brand:()=>axiosClient.get("/brand")
}

export default brandApi;