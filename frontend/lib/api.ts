import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://college-discovery-platform-mrku.onrender.com",
});

export default api;
