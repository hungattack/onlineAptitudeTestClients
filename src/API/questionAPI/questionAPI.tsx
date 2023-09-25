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
    add = async (QuestionName: string, AnswerArray: string, Answer: string, Point: number, PartId: string) => {
        try {
            const response = await http.post(`/Question/AddNew`, { QuestionName, AnswerArray, Answer, Point, PartId });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (Id: string, PartId: string) => {
        try {
            const response = await http.delete(`/Question/Delete/${Id}/${PartId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Question();
