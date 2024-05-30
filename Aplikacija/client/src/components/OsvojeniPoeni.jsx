import React from "react";



const OsvojeniPoeni = () => {

    // testiranje fetcha za studente
    const response = fetch("http://127.0.0.1:1738/student/FindAll")
                    .then(res => res.json())
                    .then(res=>
                        console.log(res)
                    );    
    
    return (
        <>
            <h2>Nula bajo moj, nula.</h2>
        </>
        
        
    )
}

export default OsvojeniPoeni;