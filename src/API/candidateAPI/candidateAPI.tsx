import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';
import { PropsOccupationData } from '../../Manager/Option/Option';

class Candidate {
    get = async (id?: string) => {
        try {
            const response = await http.get(`/Candidate/Listing/${id}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    add = async (params: {
        userId: string;
        managerId: string;
        occupationId: string;
        Name: string;
        Email: string;
        Education: string;
        Experience: string;
        PhoneNumber: string;
        BirthDay: string;
    }) => {
        try {
            const response = await http.post(`/Candidate/AddNew`, {
                ...params,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (id: number, userId?: string) => {
        try {
            const response = await http.delete(`/Candidate/Delete/${id}/${userId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    update = async (params: { Id: string; Name?: string; TimeOut?: number; OccupationId: string }) => {
        try {
            const response = await http.put('/CateParts/Update/', { ...params });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    generate = async (UserName: string, Password: string, occupationId: string, Id: number, userId?: string) => {
        try {
            const response = await http.put('/Candidate/Generate/', { UserName, Password, occupationId, userId, Id });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Candidate();