import axios from 'axios'
import {jwtDecode as jwt_decode} from "jwt-decode";
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'


const baseURL = 'http://127.0.0.1:1738'


const useAxios = () => {
    const {authToken, setAuthToken, refreshToken, setRefreshToken} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers:{Authorization: `Bearer ${authToken}`}
    });


    axiosInstance.interceptors.request.use(async req => {
    
        const user = jwt_decode(authToken)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    
        if(!isExpired) return req
    
        const response = await axios.post(`${baseURL}/refresh/`, {
            token: refreshToken
          });
    
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        
        setAuthToken(response.data.token)
        
        req.headers.Authorization = `Bearer ${response.data.token}`
        return req
    })
    
    return axiosInstance
}

export default useAxios;