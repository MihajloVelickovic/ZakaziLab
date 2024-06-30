import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginSignupPage from '../pages/LoginSignupPage';
import StudentPage from '../pages/StudentPage';
import ProfessorPage from '../pages/ProfessorPage';
import Register from '../components/Register';
import AdminPage from '../pages/AdminPage';
import AssistantPage from '../pages/AssistantPage'
import ResetPassword from '../components/ResetPassword'
import ConfirmRegister from '../components/ConfirmRegister'
import AdminRequests from '../components/AdminRequests';

import PrivateRoute from '../utils/PrivateRoute';
import PrivateRouteAdmin from '../utils/PrivateRouteAdmin';
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
                    <Route path="/student/*" element={<StudentPage/>}/>
                    <Route path="/professor/*" element={<PrivateRoute> <ProfessorPage/>    </PrivateRoute>}/>
                    <Route path="/assistant/*" element={<PrivateRoute> <AssistantPage/>    </PrivateRoute>}/>
                    <Route path="/register/:token" element={<Register/>}/>
                    <Route path="/confirm/:token" element={<ConfirmRegister/>}/>
                    <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
                    <Route path="/admin/*" element={<PrivateRouteAdmin> <AdminPage/> </PrivateRouteAdmin>}/>

             </Routes>
        </AuthProvider>
        </BrowserRouter>
         
        </>
    );
};

export default AppRoutes;