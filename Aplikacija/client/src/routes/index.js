import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';

const AppRoutes=()=>{
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/login" element={<LoginSignupPage/>}/>
                <Route exact path="/student" element={<StudentPage/>}/>
            </Routes>
        </Router>
    );
};

export default AppRoutes;