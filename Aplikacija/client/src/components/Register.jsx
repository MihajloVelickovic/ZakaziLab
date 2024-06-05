import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const sendConfirmToken = async (confirmToken) => {
    const response = await fetch(`http://127.0.0.1:1738/user/register/confirm`, {
        method: "POST",
        body: JSON.stringify(confirmToken),
        headers: {"Content-Type": "application/json"}
    });
}

const Register = () => {
    const confirmToken = useParams();
    console.log(confirmToken);
    useEffect( () => {
        sendConfirmToken(confirmToken).then(res => console.log("Server je vratio: ", res));
    },[])
    
    return (
        <h2>
            Register page
        </h2>
    )
}

export default Register;