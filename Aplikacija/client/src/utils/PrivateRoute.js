import {Route, Redirect} from 'react-router-dom'
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children, ...rest}) => {
    console.log("entered private route");
    const isAuthenticated = true;

    if (isAuthenticated) {
        return children
    } 

    return <Navigate to ="/" />
}

export default PrivateRoute;