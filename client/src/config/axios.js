import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL
const customAPI = axios.create({
  baseURL: baseURL,
});

export default customAPI