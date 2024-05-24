import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';

const AppRoutes=()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginSignupPage/>}/>
                <Route path="/student/*" element={<StudentPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;