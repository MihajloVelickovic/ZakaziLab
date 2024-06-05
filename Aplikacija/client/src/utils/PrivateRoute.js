import {Route, Redirect} from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({children, ...rest}) => {
    console.log("entered private route, checking token...");
    let {authToken} = useContext(AuthContext);

    if (authToken) {
        console.log("found token");
        return children
    } 

    console.log("didn't find student. You are probably not logged in");
    return <Navigate to ="/" />
}

export default PrivateRoute;