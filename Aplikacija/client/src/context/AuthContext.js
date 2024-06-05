import { createContext, useState, useEffect } from 'react'
//import * as jwt from 'jsonwebtoken'
import {jwtDecode as jwt_decode} from "jwt-decode";
import { Navigate, useNavigate } from 'react-router-dom'

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
        var decodedToken = jwt_decode(token);
        var user = data.user;
        console.log("decoded: ", decodedToken);

        console.log("setting tokens with useState");

        const nesto = {token: token, refreshToken: refreshToken};
        setAuthTokens(JSON.stringify(nesto.token, nesto.refreshToken));
        console.log("authTokens now has value: ", authTokens);
        console.log("user: ", user);
        console.log(user.privileges);
        window.location.href = `/${user.privileges}`;
        
    }

    let registerUser = async (e, registerInfo ) => {
        e.preventDefault()
        console.log("entered register function");
        console.log("data passed here is: ", registerInfo);
        let response = await fetch('http://127.0.0.1:1738/user/register', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(registerInfo)      //you can add {}
        })
        if (response.status == 200){
            console.log("server je uspesno poslao mail koji redirektuje na register page");

        }else {
            console.log("server nije uspesno poslao mail");
            
        }
        
        //window.location.href = `/${user.privileges}`;
        
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
        registerUser:registerUser,
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