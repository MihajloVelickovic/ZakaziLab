import { createContext, useState, useEffect } from 'react'
//import * as jwt from 'jsonwebtoken'
import {jwtDecode as jwt_decode} from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(null)//()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(null)//()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    // let [loading, setLoading] = useState(true)

    // const navigate = useNavigate()

    let loginUser = async (e, loginInfo )=> {
        e.preventDefault()
        console.log("entered login function");
        console.log("data passed here is: ", loginInfo);
        let response = await fetch('http://127.0.0.1:1738/user/login', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(loginInfo)      //you can add {}
        })
        let data = await response.json()
        console.log("response: ", data);
        const token = data.token;
        const refreshToken = data.refreshToken;
        console.log("decoded: ", jwt_decode(token));

        console.log("setting tokens with useState");

        const nesto = {token: token, refreshToken: refreshToken};
        setAuthTokens(nesto.token, nesto.refreshToken);
        console.log("authTokens now has value: ", authTokens);
        console.log("this isn't working");
        // console.log("response: ", response);

        // if(response.status === 200){
        //     setAuthTokens(data)
        //     setUser(jwt_decode(data.access))
        //     localStorage.setItem('authTokens', JSON.stringify(data))
        //     navigate.push('/')
        // }else{
        //     alert('Something went wrong!')
        // }
    }


    // let logoutUser = () => {
    //     setAuthTokens(null)
    //     setUser(null)
    //     localStorage.removeItem('authTokens')
    //     navigate.push('/login')
    // }


    // let updateToken = async ()=> {

    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({'refresh':authTokens?.refresh})
    //     })

    //     let data = await response.json()
        
    //     if (response.status === 200){
    //         setAuthTokens(data)
    //         setUser(jwt_decode(data.access))
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //     }else{
    //         logoutUser()
    //     }

    //     if(loading){
    //         setLoading(false)
    //     }
    // }

    let contextData = {
        // user:user,
        // authTokens:authTokens,
        loginUser:loginUser,
        // logoutUser:logoutUser,
    }


    // useEffect(()=> {

    //     if(loading){
    //         updateToken()
    //     }

    //     let fourMinutes = 1000 * 60 * 4

    //     let interval =  setInterval(()=> {
    //         if(authTokens){
    //             updateToken()
    //         }
    //     }, fourMinutes)
    //     return ()=> clearInterval(interval)

    // }, [authTokens, loading])

    return(
        // <AuthContext.Provider value={contextData} >
        //     {loading ? null : children}
        // </AuthContext.Provider>
        
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
        
    )
}