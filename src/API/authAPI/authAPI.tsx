import { AxiosError } from "axios";
import errorHandling from "../errorHandling";
import http from "../../utils/http";

class AuthAPI {
  Login = async (value: { Email: string; Password: string }) => {
    try {
      const response = await http.post("/Auth/Login", { ...value });
      console.log(response);

      return response.data;
    } catch (error) {
      const err: any = error as AxiosError;
      return errorHandling(err);
    }
  };
  Register = async (dataUser: {
    Name: string;
    Email: string;
    Password: string;
    Gender: boolean;
  }) => {
    try {
      const res = await http.post("/Auth/Register", { ...dataUser });
      return res.data;
    } catch (error) {
      const err: any = error as AxiosError;
      return errorHandling(err);
    }
  };
}
export default new AuthAPI();
