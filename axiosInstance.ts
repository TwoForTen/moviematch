import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '3d26df9f2ff7c64a0ec0c6f007e59142',
  },
});

export default axiosInstance;
