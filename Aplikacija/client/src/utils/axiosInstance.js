import axios from 'axios'
import {jwtDecode as jwt_decode} from "jwt-decode";
import dayjs from 'dayjs'

const baseURL = 'http://127.0.0.1:1738';

let authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null;
console.log("useo je authToken sa local storage-a ovde");
let refreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null;

const axiosInstance = axios.create({
    baseURL,
    headers:{Authorization: `Bearer ${localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null}`}
})


axiosInstance.interceptors.request.use(async req => {
    if(!authToken){
        console.log("ulazi ovde");
        authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null
        refreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
        req.headers.Authorization = `Bearer ${authToken}`
    }
    else {
        authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null
        refreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null
    }
    

    console.log("ulazi ovde drugde");
    const user = jwt_decode(authToken)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if(!isExpired) {
        console.log("not expired");
        req.headers.Authorization = `Bearer ${authToken}`
        return req
    }
    
    console.log("expired");
    var token = refreshToken
    console.log(token);
    //const response = await axios.post(`${baseURL}/user/refresh`, {});
    let response = await fetch('http://127.0.0.1:1738/user/refresh/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({token})//JSON.stringify({'token':refreshToken})
    })
    console.log(response);

      //body:JSON.stringify({token})//JSON.stringify({'token':refreshToken})
    let data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    console.log("token: ", data.token, "refresh token: ", data.refreshToken);
    req.headers.Authorization = `Bearer ${data.token}`
    return req
})

export default axiosInstance;