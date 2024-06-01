import axios from "axios";

const api = axios.create({
  baseURL: "https://qaleelo-server.vercel.app/",
});

export default api;
