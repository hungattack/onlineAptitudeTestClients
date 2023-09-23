import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';
import { PropsOccupationData } from '../../Manager/Option/Option';

class Question {
    getQuestion = async (id: string) => {
        try {
            const response = await http.get(`/Question/GetById/${id}`);
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
}
export default new Question();
