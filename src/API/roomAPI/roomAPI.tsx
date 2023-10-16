import { AxiosError } from 'axios';
import errorHandling from '../errorHandling';
import http from '../../utils/http';

class Room {
    getRoom = async (id: string, userId?: string) => {
        try {
            const response = await http.get(`/Room/GetRoom/${id}/${userId}`);
            return response.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Room();
