import { AxiosError } from "axios";
import errorHandling from "../errorHandling";
import http from "../../utils/http";
import { PropsOccupationData } from "../../Manager/Option/Option";

class Occupation {
  getOccupation = async (id?: string) => {
    try {
      const response = await http.get<PropsOccupationData[]>(
        `/Occupation/GetById/${id}`
      );
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
}
export default new Occupation();
