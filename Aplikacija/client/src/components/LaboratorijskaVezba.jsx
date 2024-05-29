import React from "react";

const LaboratorijskaVezba = ({role}) => {
    const renderStudentLab = () => (
        <>
            <h2>Student: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );
    const renderProfessorLab = () => (
        <>
            <h2>Professor: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );
    const renderAdminLab = () => (
        <>
            <h2>Admin: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );

    let renderContext;
    switch (role) {
        case 'admin':
            renderContext = renderAdminLab();
            break;
        case 'professor':
            renderContext = renderProfessorLab();
            break;
        case 'student':
        default:
            renderContext = renderStudentLab();
            break;
    }

    return (
        <>
        <div>
            <h2>This is the laboratories section</h2>
            {renderContext}
        </div>
        </>
    )
}

export default LaboratorijskaVezba;