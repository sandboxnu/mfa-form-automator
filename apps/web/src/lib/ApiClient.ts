import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:' + process.env.PORT,
});

export default apiClient;