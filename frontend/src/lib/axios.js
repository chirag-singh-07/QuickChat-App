import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api"
      : "/api",
  withCredentials: true, // To enable cookies for authenticated requests
  headers: {
    "Content-Type": "application/json",
  },
});
