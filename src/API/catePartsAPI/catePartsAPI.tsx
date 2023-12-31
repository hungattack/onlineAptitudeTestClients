import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';
import { PropsOccupationData } from '../../Manager/Option/Option';

class CateParts {
    getCatePart = async (id?: string) => {
        try {
            const response = await http.get<PropsOccupationData[]>(`/CateParts/GetById/${id}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    addCatePart = async (OccupationId: string, Name: string) => {
        try {
            const response = await http.post(`/CateParts/AddNew`, {
                OccupationId,
                Name,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (id: string, occupationId: string, userId?: string) => {
        try {
            const response = await http.delete(`/CateParts/Delete/${id}/${occupationId}/${userId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    update = async (params: {
        Id: string;
        Name?: string;
        TimeOut?: number;
        TimeType?: string;
        OccupationId: string;
    }) => {
        try {
            const response = await http.put('/CateParts/Update/', { ...params });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new CateParts();
