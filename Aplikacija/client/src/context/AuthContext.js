import { createContext, useState, useEffect } from 'react'
//import * as jwt from 'jsonwebtoken'
import {jwtDecode as jwt_decode} from "jwt-decode";
import { Navigate, useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    
    let [authToken, setAuthToken] = useState(()=> localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null)
    let [refreshToken, setRefreshToken] = useState(()=> localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null)
    //let [user, setUser] = useState(()=> localStorage.getItem('user') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     console.log("Auth context initialized");
    //     console.log("authToken:", authToken);
    //     console.log("refreshToken:", refreshToken);
    // }, []);

    const navigate = useNavigate()

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

        if (response.status === 200){
            var tokenReceived = data.token;
            var refreshTokenReceived = data.refreshToken;
            var userReceived = data.user;

            console.log("setting tokens with useState");
            console.log("response is: ", data);
            console.log("user is from data: ", data.user);
            setAuthToken(tokenReceived);
            setRefreshToken(refreshTokenReceived);
            //setUser(userReceived);
            
            console.log("authToken: ", tokenReceived);
            console.log("refreshToken: ", refreshTokenReceived);
            console.log("user: ", userReceived);
            console.log(userReceived.privileges);

            localStorage.setItem('authToken', tokenReceived);
            localStorage.setItem('refreshToken', refreshTokenReceived);
            localStorage.setItem('user', JSON.stringify(userReceived));
            window.location.href = `/${userReceived.privileges}`;
            
        }
        else {
            console.log("something went wrong, here's the error message: ", data.message);
        }
        
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
        let jsonResponse = await response.json();
        let message = jsonResponse.message;

        if (response.status == 200){
            console.log("server je uspesno poslao mail koji redirektuje na register page", message);

        }else if (response.status == 400) {
            console.log("server nije uspesno poslao mail, error 400", message);
            alert(message);
        }
        
        
        //window.location.href = `/${user.privileges}`;
        
    }


    let logoutUser = () => {
        console.log("strting logout");
        setAuthToken(null);
        setRefreshToken(null);
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = `/login`;
    }


    let updateToken = async ()=> {

        var token = refreshToken;
        let response = await fetch('http://127.0.0.1:1738/user/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({token})//JSON.stringify({'token':refreshToken})
        })

        let data = await response.json()
        
        if (response.status === 200){
            console.log("successful response from updateToken");
            setAuthToken(data.token);
            setRefreshToken(data.refreshToken);
            //setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
        }else{
            //logoutUser()
            console.log("unsuccessful update token");
            console.log("result je: ", response)
        }

        // if(loading){
        //     setLoading(false)
        // }
    }

    let contextData = {
        authToken:authToken,
        refreshToken:refreshToken,
        loginUser:loginUser,
        registerUser:registerUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {

        // if(loading){
        //     updateToken()
        // }

        // let oneMinutes = 1000 * 60 * 1

        // let interval =  setInterval(()=> {
        //     if(authToken){
        //         updateToken()
        //     }
        // }, oneMinutes)
        // return ()=> clearInterval(interval)

    }, [authToken, refreshToken, loading])

    return(
        // <AuthContext.Provider value={contextData} >
        //     {loading ? null : children}
        // </AuthContext.Provider>
        
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
        
    )
}