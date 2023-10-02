import axios, { AxiosInstance } from 'axios';
axios.defaults.withCredentials = true;
class Http {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_NEGA,
            headers: {
                contentType: 'application/json',
            },
        });
    }
}
const http = new Http().instance;
export default http;
