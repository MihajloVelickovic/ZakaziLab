import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const sendConfirmToken = async (confirmToken, setMessage) => {
    const response = await fetch(`http://127.0.0.1:1738/user/register/confirm`, {
        method: "POST",
        body: JSON.stringify(confirmToken),
        headers: {"Content-Type": "application/json"}
    });
    var receivedMessage = await response.json();
    if (response.status === 200) {
        console.log("uspesno, vracena porkua je:", receivedMessage.message);
        //window.location.href = `/${receivedUser.privileges}`;
    }else {
        console.log("neuspesno, poruka je: ", receivedMessage.message);
    }
    
    setMessage(receivedMessage.message);
    //return data;
}

const Register = () => {
    const confirmToken = useParams();
    const [message, setMessage] = useState(null);
    console.log(confirmToken);
    useEffect( () => {
        sendConfirmToken(confirmToken, setMessage);
        //ovde sad treba da se redirektuje do odredjene stranice (student, admin...);
    },[confirmToken])

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                window.location.href = `/login`;
            }, 3000); // 3 seconds delay

            return () => clearTimeout(timer); // Clean up the timer if the component unmounts or message changes
        }
    }, [message]); // Adding message and history as dependencies to useEffect
    
    return (
        <h2>
            Register page
            {message?<p>{message}</p>: <p>Jos se nije primila poruka</p>}
        </h2>
    )
}

export default Register;