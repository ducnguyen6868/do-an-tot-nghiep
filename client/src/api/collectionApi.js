import axiosClient from './axiosClient';

const collectionApi = {
    getCollections :()=>axiosClient.get('/collection')
}

export default collectionApi;