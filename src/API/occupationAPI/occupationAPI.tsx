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
    deleteInfo = async (id: number, occupationId: string, managerId: string) => {
        try {
            const response = await http.delete(`/Occupation/DeleteInfo/${id}/${occupationId}/${managerId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    addInfo = async (
        Info: {
            occupationId: string;
            introduction: string;
            position: string;
            address: string;
            company: string;
            contact: string;
            name: string;
            requirement: string;
        },
        manaId: string,
    ) => {
        try {
            const response = await http.post(`/Occupation/AddInfo`, {
                OccupationId: Info.occupationId,
                Introduction: Info.introduction,
                Position: Info.position,
                Address: Info.address,
                Company: Info.company,
                Contact: Info.contact,
                Name: Info.name,
                Requirement: Info.requirement,
                managerId: manaId,
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
