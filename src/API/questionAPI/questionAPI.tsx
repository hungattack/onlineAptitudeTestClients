import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';
import { PropsOccupationData } from '../../Manager/Option/Option';

class Question {
    getQuestion = async (id: string, type: string) => {
        try {
            const response = await http.get(`/Question/GetById/${id}/${type}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    add = async (
        QuestionName: string,
        Point: number,
        PartId: string,
        AnswerType: string,
        AnswerArray?: string,
        Answer?: string,
    ) => {
        try {
            const response = await http.post(`/Question/AddNew`, {
                QuestionName,
                AnswerType,
                AnswerArray,
                Answer,
                Point,
                PartId,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    update = async (
        Id: string,
        UserId: string,
        PartId: string,
        OccupationId: string,
        QuestionName: string,
        Point: number,
        Type: string,
        AnswerArray?: string,
        Answer?: string,
    ) => {
        try {
            const response = await http.put(`/Question/Update`, {
                Id,
                UserId,
                PartId,
                OccupationId,
                QuestionName,
                Point,
                AnswerArray,
                Answer,
                Type,
            });
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
