import React from "react";

const KalendarAktivnosti = ({role}) => {
    const renderStudentActivities = () => (
        <>
            <h2>Student: Imas toliko toga da me mrzi da ih listam ovde.</h2>
        </>
    );
    const renderProfessorActivities = () => (
        <>
            <h2>Professor: Imas toliko toga da me mrzi da ih listam ovde.</h2>
        </>
    );
    const renderAdminActivities = () => (
        <>
            <h2>Admin: Imas toliko toga da me mrzi da ih listam ovde.</h2>
        </>
    );

    let renderContext;
    switch (role) {
        case 'admin':
            renderContext = renderAdminActivities();
            break;
        case 'professor':
            renderContext = renderProfessorActivities();
            break;
        case 'student':
        default:
            renderContext = renderStudentActivities();
            break;
    }

    return (
        <>
        <div>
            <h2>This is the activities section</h2>
            {renderContext}
        </div>
        </>
    )
}

export default KalendarAktivnosti;