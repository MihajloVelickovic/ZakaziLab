import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {jwtDecode as jwt_decode} from "jwt-decode";

const ConfirmRegister = () => {
    const { token } = useParams();
    const [message, setMessage] = useState(null);
    const [tokenData, setTokenData] = useState(null);

    useEffect(() => {
        if (token) {
            const decodedToken = jwt_decode(token);
            setTokenData(decodedToken);
        }
    }, [token]);

    const handleConfirm = async (status) => {
        const response = await fetch(`http://127.0.0.1:1738/register/confirm`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });
        const receivedMessage = await response.json();
        if (response.status === 200) {
            console.log("Successful, message returned:", receivedMessage.message);
        } else {
            console.log("Unsuccessful, message is:", receivedMessage.message);
        }
        setMessage(receivedMessage.message);
    };

    useEffect(() => {
        if (message === "Završena registracija") {
            const timer = setTimeout(() => {
                window.location.href = `/login`;
            }, 3000); // 3 seconds delay
            return () => clearTimeout(timer); // Clean up the timer if the component unmounts or message changes
        }
    }, [message]);

    return (
        <>
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Potvrđivanje novog korisničkog naloga
            </h2>
            <div>
                <h3>Informacije o novom korisniku</h3>
                {tokenData && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.keys(tokenData).map((key) => (
                            <div key={key}>
                                <strong>{key}:</strong> {tokenData[key]}
                            </div>
                        ))}
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={() => handleConfirm(true)}>Confirm</button>
                            <button onClick={() => handleConfirm(false)}>Refuse</button>
                        </div>
                    </div>
                )}
            </div>
            {message && <div>{message}</div>}
        </>
    );
}

export default ConfirmRegister;
