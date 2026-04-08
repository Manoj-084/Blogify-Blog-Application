import axios from "axios"
import { token } from "./config";
import { configs } from "eslint-plugin-react-refresh";

const instance = axios.create({
  baseURL: "http://localhost:8000/api"
})

instance.interceptors.response.use((response) => {
  return response.data;
})

instance.interceptors.request.use((config) => {
 const tokenString = token();

if (tokenString) {
  config.headers.Authorization = `Bearer ${tokenString}`
}

return config;
})

export default instance