import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';
import ProfessorPage from '../pages/ProfessorPage';

const AppRoutes=()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginSignupPage/>}/>
                <Route path="/student/*" element={<StudentPage/>}/>
                <Route path="/professor/*" element={<ProfessorPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;