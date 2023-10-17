import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';

class QuestionHistory {
    add = async (UserId: string, RoomId: string, total: number) => {
        try {
            const response = await http.post(`/ResultHistory/AddNew`, {
                UserId,
                OccupationId: RoomId,
                Point: total,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (occupationId: string, userId: string, manaId?: string) => {
        try {
            const response = await http.delete(`/ResultHistory/Delete/${occupationId}/${userId}/${manaId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    addResult = async (UserId: string, RoomId: string, CatePartId: string, Result: string) => {
        try {
            const response = await http.post(`/ResultHistory/AddNewResult`, {
                UserId,
                OccupationId: RoomId,
                CatePartId,
                Answer: Result,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new QuestionHistory();
