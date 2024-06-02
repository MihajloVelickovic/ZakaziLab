import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';
import ProfessorPage from '../pages/ProfessorPage';

import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { InteractionType } from '@azure/msal-browser';

const AppRoutes=()=>{

    const { instance, accounts } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
        console.error(e);
        });
    };

    const getUserDetails = () => {
        if (accounts.length > 0) {
        const account = accounts[0];
        return (
            <div>
            <h3>User Details</h3>
            <p>Username: {account.idTokenClaims.name}</p>
            <p>Email: {account.username}</p>
            </div>
        );
        }
        return null;
    };


    return(
        <>
            <div>
                <h2>Something</h2>
            </div>
            <div>
            <h1>Welcome to Your App</h1>
            <button onClick={handleLogin}>Login with Azure AD</button>
            {getUserDetails()}
            </div>
        </>
        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/" element={<HomePage/>}/>
        //         <Route path="/login" element={<LoginSignupPage/>}/>
        //         <Route path="/student/*" element={<StudentPage/>}/>
        //         <Route path="/professor/*" element={<ProfessorPage/>}/>
        //     </Routes>
        // </BrowserRouter>
    );
};

export default AppRoutes;