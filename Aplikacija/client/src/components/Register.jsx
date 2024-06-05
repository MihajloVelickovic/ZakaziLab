import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const sendConfirmToken = async (confirmToken) => {
    const response = await fetch(`http://127.0.0.1:1738/user/register/confirm`, {
        method: "POST",
        body: JSON.stringify(confirmToken),
        headers: {"Content-Type": "application/json"}
    });
    if (response.status == 200) {
        const receivedUser = await response.json();
        console.log("vracen user:", receivedUser);
        window.location.href = `/${receivedUser.privileges}`;
    }else {
        console.log("status responsa nije bio ok, server nije prizao taj token, mozda je proslo previse vremena");
    }
    
    //return data;
}

const Register = () => {
    const confirmToken = useParams();
    console.log(confirmToken);
    useEffect( () => {
        sendConfirmToken(confirmToken);
        //ovde sad treba da se redirektuje do odredjene stranice (student, admin...);
    },[])
    
    return (
        <h2>
            Register page
        </h2>
    )
}

export default Register;