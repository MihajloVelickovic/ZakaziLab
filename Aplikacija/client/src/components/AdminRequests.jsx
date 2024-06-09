import React, { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';
import {jwtDecode as jwt_decode} from "jwt-decode";
import "../styles/AdminRequests.css";

const AdminRequests = () => {
    const [tokens, setTokens] = useState([]);
    const [usersData, setUsersData] = useState([]);

    // Fetch tokens from the backend
    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axiosInstance.get("/regRequest/findAll");
                setTokens(response.data);
            } catch (error) {
                console.error("Error fetching tokens:", error);
            }
        };

        fetchTokens();
    }, []);

    // Decode tokens to get user data
    useEffect(() => {
        const decodedUsers = tokens.map(tokenObj => {
            const decodedToken = jwt_decode(tokenObj.token);
            console.log(decodedToken);
            return {
                token: tokenObj.token,
                ...decodedToken.data
            };
        });
        setUsersData(decodedUsers);
    }, [tokens]);

    // Handle accept/refuse requests
    const handleRequest = async (token, status, message = "") => {
        try {
            await axiosInstance.post("/user/register/confirm", {
                requestToken: token,
                status,
                message
            });
            // Update the UI by removing the handled request
            setUsersData(usersData.filter(user => user.token !== token));
        } catch (error) {
            console.error("Error handling request:", error);
        }
    };

    return (
        <>
            <h2>Zahtevi za registraciju</h2>
            <div className="requests-container">
                {usersData.map(user => (
                    <div key={user.token} className="request-card request-conainter">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Privileges:</strong> {user.privileges}</p>
                        <div className="buttons">
                            <button onClick={() => handleRequest(user.token, true)}>Accept</button>
                            <button onClick={() => handleRequest(user.token, false, "Reason for refusal")}>Refuse</button>
                        </div>
                    </div>
                ))}
                {/* {Object.keys(tokenData.data).filter(key => key !== 'password').map((key) => (
                            <div key={key}>
                                <strong>{key}:</strong> {tokenData.data[key]}
                            </div>
                ))} */}
            </div>
        </>
    );
};

export default AdminRequests;
