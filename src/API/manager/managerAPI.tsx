import { AxiosError } from "axios";
import errorHandling from "../errorHandling";
import http from "../../utils/http";

class ManagerAPI {
  SendRequest = async (value: {
    Name: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
    userId: string;
  }) => {
    try {
      const response = await http.post("/Manager/SendRequest", { ...value });
      console.log(response);

      return response.data;
    } catch (error) {
      const err: any = error as AxiosError;
      return errorHandling(err);
    }
  };
}
export default new ManagerAPI();
