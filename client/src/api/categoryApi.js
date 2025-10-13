import axiosClient from "./axiosClient";

const categoryApi = {
    category:()=>axiosClient.get("/category")
}

export default categoryApi;