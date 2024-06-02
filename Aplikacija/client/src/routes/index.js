import React, { useState } from 'react';
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
    //instance.clearCache();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
        instance.loginRedirect(loginRequest).catch(e => {
        console.error(e);
        });
    };

    const getUserDetails = () => {
        if (accounts.length > 0) {
        const account = accounts[0];
        return (
            <div>
            <p style={{fontWeight: 'bold'}}>User Details</p>
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
            <h3>OpenID works! I don't care if it's ugly {">:3"}</h3>
            <button onClick= {handleLogin} show="false">OpenID connect</button>
            {getUserDetails()}
            
            
            </div>
         <BrowserRouter>
             <Routes>
                 <Route path="/" element={<HomePage/>}/>
                 <Route path="/login" element={<LoginSignupPage/>}/>
                 <Route path="/student/*" element={<StudentPage/>}/>
                 <Route path="/professor/*" element={<ProfessorPage/>}/>
             </Routes>
         </BrowserRouter>
        </>
    );
};

export default AppRoutes;