import {Route, Redirect} from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import {jwtDecode as jwt_decode} from "jwt-decode";

const PrivateRouteAdmin = ({children, ...rest}) => {
    console.log("entered private route, checking token...");
    //let {authToken} = useContext(AuthContext);

    let authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null
    if (authToken){
        const user = jwt_decode(authToken);
        console.log(user.privileges);
        if (user.privileges == "admin")
            return children;
    }
    console.log("Nedovoljne privilegije");
    return <Navigate to ="/" />

    console.log("didn't find student. You are probably not logged in");
    return <Navigate to ="/" />
}

export default PrivateRouteAdmin;