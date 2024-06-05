import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';
import ProfessorPage from '../pages/ProfessorPage';
import Register from '../components/Register';

import PrivateRoute from '../utils/PrivateRoute';
import { AuthProvider } from '../context/AuthContext';

//AuthProvider



const AppRoutes=()=>{

    return(
        <>
         <BrowserRouter>
         <AuthProvider>
             <Routes>
                    <Route exact path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginSignupPage/>}/>
                    <Route path="/student/*" element={<PrivateRoute>   <StudentPage/>  </PrivateRoute>}/>
                    <Route path="/professor/*" element={<PrivateRoute> <ProfessorPage/>    </PrivateRoute>}/>
                    <Route path="/register/:token" element={<Register/>}/>

             </Routes>
        </AuthProvider>
        </BrowserRouter>
         
        </>
    );
};

export default AppRoutes;