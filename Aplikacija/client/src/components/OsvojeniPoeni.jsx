import React, { useEffect, useState } from "react";
import "../styles/OsvojeniPoeni.css";

const fetchData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:1738/studentEntry/findAll');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const ListItem = ({ _id, student, attendance, timeSlot, points, labName, __v }) => (
  <li>
    {_id} &mdash; {labName} &mdash; {student.index}
  </li>
);

const ListItems = ({ items }) => (
  <ul>
    {items.map((props) => (
      <ListItem key={props._id} {...props} />
    ))}
  </ul>
);

const OsvojeniPoeni = () => {
  const [result, setResult] = useState([]);

  useEffect(() => {
    fetchData().then((res) => {
        console.log('Fetched data:', res);
      setResult(res);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <div>
      {result.length > 0 && <ListItems items={result} />}
    </div>
  );
}

export default OsvojeniPoeni;


    // const yourDataObject = { labName: "OOP"};
    // , {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(yourDataObject)


        
    // return (
        
    //     <>
    //         <h2>Nula bajo moj, nula.</h2>
    //         <div className="resultati">
    //         </div>
    //     </>   
    // )


       // const response = fetch("http://127.0.0.1:1738/studentEntry/findAll")
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     const filteredData = data.filter(entry => 
    //                         entry.student.index === Sindex
    //                     );
    //                     //filteredData.forEach(p => console.log(p));
    //                     return filteredData;
    //                 })
    //                 .then(result => {
    //                     console.log(result); // If you want to do something with the result
    //                 })
    //                 .catch(error => console.error('Error:', error));