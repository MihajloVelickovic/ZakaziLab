import React, { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';
import {jwtDecode as jwt_decode} from "jwt-decode";
import "../styles/AdminRequests.css";

const AdminRequests = () => {
    const [tokens, setTokens] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [refusalMessages, setRefusalMessages] = useState({});

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
            console.log(jwt_decode(token));
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

    const handleMessageChange = (token, message) => {
        setRefusalMessages(prevState => ({
            ...prevState,
            [token]: message
        }));
    };

    return (
        <>
            <h2>Zahtevi za registraciju</h2>
            <div className="request-conainter">
                {usersData.map(user => (
                    <div key={user.token} className="request-card">
                        {Object.keys(user)
                            .filter(key => key !== 'token' && key !== 'password')
                            .map(key => (
                                <div key={key}>
                                    <strong>{key}:</strong> {user[key]}
                                </div>
                        ))}
                        <div className="adminRequests_buttons_inputs">
                            <input
                                type="text"
                                placeholder="Razlog odbijanja: "
                                value={refusalMessages[user.token] || ""}
                                onChange={(e) => handleMessageChange(user.token, e.target.value)}
                            />
                            <div>
                            <button className="AcceptanceButtons acceptButton01" onClick={() => handleRequest(user.token, true)}>Accept</button>
                            <button className="AcceptanceButtons refuseButton01" onClick={() => handleRequest(user.token, false, "Reason for refusal")}>Refuse</button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* {usersData.map(user => (
                    <>
                    {user.map( (key) => (
                    <div key = {key}>
                        <strong>{key}:</strong> {user[key]}
                    </div>
                    ))}
                    <button className="AcceptanceButtons" onClick={() => handleRequest(user.token, true)}>Accept</button>
                    <button className="AcceptanceButtons" onClick={() => handleRequest(user.token, false, "Reason for refusal")}>Refuse</button>
                    </>
                ))} */}
                    
                            
                
                {/* {usersData.map(user => (
                    <div key={user.token} className="request-card request-conainter">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Privileges:</strong> {user.privileges}</p>
                        <div>
                            <button className="AcceptanceButtons" onClick={() => handleRequest(user.token, true)}>Accept</button>
                            <button className="AcceptanceButtons" onClick={() => handleRequest(user.token, false, "Reason for refusal")}>Refuse</button>
                        </div>
                    </div>
                ))} */}
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
