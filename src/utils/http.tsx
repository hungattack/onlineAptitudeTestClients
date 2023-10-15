import axios, { AxiosInstance } from 'axios';
axios.defaults.withCredentials = true;
class Http {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_NEGA,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    }
}
const http = new Http().instance;
export default http;
