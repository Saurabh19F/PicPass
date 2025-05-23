const BASE_URL = import.meta.env.PROD
  ? "https://picpass-server.onrender.com" // 🔁 REPLACE with your deployed backend URL
  : "http://localhost:8080";

export default BASE_URL;
