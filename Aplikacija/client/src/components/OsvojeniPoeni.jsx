import React from "react";
import "../styles/OsvojeniPoeni.css";


const OsvojeniPoeni = () => {

    // testiranje fetcha za studente
    let Sindex = 18588;
    let result;
    // const response = fetch("http://127.0.0.1:1738/studentEntry/filteredFind")
    //                 .then(res => res.json())
    //                 .then(res=>
    //                     res.forEach(p => console.log(p.labName))
    //                 ).then(res => {
    //                     result = res;
    //                 });

    
    const renderFunction = (result) => {
        let element = document.querySelector('rezultati');
        
    }
    
    // const yourDataObject = { labName: "OOP"};
    // , {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(yourDataObject)

    const response = fetch("http://127.0.0.1:1738/studentEntry/findAll")
                    .then(res => res.json())
                    .then(data => {
                        const filteredData = data.filter(entry => 
                            entry.student.index === Sindex
                        );
                        //filteredData.forEach(p => console.log(p));
                        return filteredData;
                    })
                    .then(result => {
                        console.log(result); // If you want to do something with the result
                    })
                    .catch(error => console.error('Error:', error));


    
    return (
        <>
            <h2>Nula bajo moj, nula.</h2>
            <div className="resultati">
            </div>
        </>
        
        
    )
}

export default OsvojeniPoeni;