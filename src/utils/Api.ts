import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
})

axiosInstance.defaults.headers.common["Content-Type"] = 'application/json'
axiosInstance.defaults.headers.common['Accept'] = '*/*'
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'


export default axiosInstance