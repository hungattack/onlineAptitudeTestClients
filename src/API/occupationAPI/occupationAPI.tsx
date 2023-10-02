import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';
import { PropsOccupationData } from '../../Manager/Option/Option';

class Occupation {
    getOccupation = async (id?: string) => {
        try {
            const response = await http.get(`/Occupation/GetById/${id}`);
            return response.data.$values;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getInfo = async (id: string) => {
        try {
            const response = await http.get(`/Occupation/GetInfo/${id}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    addOccupation = async (userId: string, Name: string) => {
        try {
            const response = await http.post(`/Occupation/AddNew`, { userId, Name });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (id: string) => {
        try {
            const response = await http.delete(`/Occupation/Delete/${id}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    addInfo = async (Id: string, Info: string) => {
        try {
            const response = await http.post(`/Occupation/AddInfo`, {
                Id,
                Info,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getInfoListing = async () => {
        try {
            const response = await http.get(`/Occupation/GetListing`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    active = async (occupationId: string, userId: string) => {
        try {
            const response = await http.patch(`/Occupation/Active/${occupationId}/${userId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Occupation();