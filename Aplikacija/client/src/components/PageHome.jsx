import React from "react";

const PageHome = ({role}) => {
    const renderStudentHomePage = () => (
        <>
            <h2>Student: This is what will he shown first, maybe we can put like: This is the page for student... you can do this...</h2>
        </>
    );
    const renderProfessorHomePage = () => (
        <>
            <h2>Professor: This is what will he shown first, maybe we can put like: This is the page for student... you can do this...</h2>
        </>
    );
    const renderAdminHomePage = () => (
        <>
            <h2>Admin: This is what will he shown first, maybe we can put like: This is the page for student... you can do this...</h2>
        </>
    );

    let renderContext;
    switch (role) {
        case 'admin':
            renderContext = renderAdminHomePage();
            break;
        case 'professor':
            renderContext = renderProfessorHomePage();
            break;
        case 'student':
        default:
            renderContext = renderStudentHomePage();
            break;
    }

    return (
        <>
        <div>
            <h2>This is the home section</h2>
            {renderContext}
        </div>
        </>
    )
}

export default PageHome;