import { AxiosError } from "axios";
import errorHandling from "../errorHandling";
import http from "../../utils/http";

class UserAPI {
  GeById = async (id: string) => {
    try {
      const response = await http.get(`/User/GetById/${id}`);
      return response.data;
    } catch (error) {
      const err: any = error as AxiosError;
      return errorHandling(err);
    }
  };
}
export default new UserAPI();
