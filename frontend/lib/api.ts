import axios from "axios";

const api = axios.create({
  baseURL: "https://college-discovery-platform-mrku.onrender.com",
});

export default api;