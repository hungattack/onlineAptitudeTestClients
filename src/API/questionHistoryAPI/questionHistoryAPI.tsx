import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';

class QuestionHistory {
    add = async (
        UserId: string,
        RoomId: string,
        CatePartId: string,
        Result: {
            id: string;
            name: string;
            answer: string;
            pointAr: string;
            user: string | string[];
        },
    ) => {
        try {
            const response = await http.post(`/ResultHistory/AddNew`, {
                UserId,
                OccupationId: RoomId,
                CatePartId,
                QuestionId: Result.id,
                Answer: Result.user,
            });
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new QuestionHistory();
