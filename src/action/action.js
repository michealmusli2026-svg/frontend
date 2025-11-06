import axios from "axios";
import { loginRoute } from "../api/routes";

export const doLogin = (body)=>async(dispatch) => {
 await axios.post(loginRoute, body)
   .then(response => {
        return response.data;
   })
   .catch(error => {
        console.error("Login error:", error);
   });
}