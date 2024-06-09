import React from "react";
import { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance'

var user = null;
if (localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'));
    console.log("user sa localStorage-a: ", user);
}

const PageHome = ({role}) => {
    const [entries, setEntries] = useState([]);
    const [studentIndex, setStudentIndex] = useState(null);


    const renderStudentHomePage = () => (
        <>
            <div className="user-info">
                <h2>Prijavljen korisnik: </h2>
                <h2>Ime: {user.name}</h2>
                <h2>Prezime: {user.lastName}</h2>
                <h2>Email: {user.email}</h2>
            </div>
        </>
    );
    // const renderProfessorHomePage = () => (
    //     <>
    //         <h2>Professor: This is what will he shown first, maybe we can put like: This is the page for student... you can do this...</h2>
    //     </>
    // );
    // const renderAdminHomePage = () => (
    //     <>
    //         <h2>Admin: This is what will he shown first, maybe we can put like: This is the page for student... you can do this...</h2>
    //     </>
    // );

    let renderContext;
    switch (role) {
        // case 'admin':
        //     renderContext = renderAdminHomePage();
        //     break;
        // case 'professor':
        //     renderContext = renderProfessorHomePage();
        //     break;
        case 'student':
        default:
            renderContext = renderStudentHomePage();
            break;
    }

    return (
        <>
        <div>
            {renderContext}
        </div>
        </>
    )
}

export default PageHome;