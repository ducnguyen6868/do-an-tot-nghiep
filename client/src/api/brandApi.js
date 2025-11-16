import axiosClient from "./axiosClient";

const brandApi = {
    getBrands:()=>axiosClient.get("/brand")
}

export default brandApi;