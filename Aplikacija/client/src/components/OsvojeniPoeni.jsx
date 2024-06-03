/* import React, { useEffect, useState } from "react";
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

export default OsvojeniPoeni; */
 


import React, { useEffect, useState } from "react";
import "../styles/OsvojeniPoeni.css";

const user = JSON.parse(localStorage.getItem('userData'));
const ID = user._id;
const Index = user.index;
//console.log(ID);
console.log("user je: ", user);

const fetchData = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:1738/studentEntry/filteredFind`, {
                method: "POST",
                body: JSON.stringify({student: user}),
                headers: {"Content-Type": "application/json"}
            });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log("ovo sam fethovao buraz: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const OsvojeniPoeni = () => {
    const [entries, setEntries] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [studentIndex, setStudentIndex] = useState(null);

    useEffect(() => {
        fetchData()
            .then((res) => {
                console.log('Fetched data:', res);
                // const filteredEntries = res.filter(entry => entry.student.index === 18569);
                const filteredEntries = res;
                setEntries(filteredEntries);
                if (filteredEntries.length > 0) {
                    setStudentIndex(filteredEntries[0].student.index);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const toggleLab = (labName) => {
        setSelectedLabs(prevSelectedLabs => {
            if (prevSelectedLabs.includes(labName)) {
                return prevSelectedLabs.filter(name => name !== labName);
            } else {
                return [...prevSelectedLabs, labName];
            }
        });
    };

    const renderTables = () => {
        const tables = {};

        entries.forEach(entry => {
            if (!tables[entry.labName]) {
                tables[entry.labName] = {
                    points: [],
                    totalPoints: 0
                };
            }
            tables[entry.labName].points.push(...entry.points);
            tables[entry.labName].totalPoints += entry.points.reduce((acc, cur) => acc + cur, 0);
        });

        return (
            <div>
                <h2>Osvojeni poeni na laboratorijskim vezbama</h2>
                <p>Student: {user.name} {user.lastName}</p>
                <p>Indeks: {Index}</p>
                {Object.keys(tables).map((labName, index) => (
                    <div key={index} className="lab-table">
                        <button className={selectedLabs.includes(labName) ? "active" : ""} onClick={() => toggleLab(labName)}>{labName}</button>
                        <div className={selectedLabs.includes(labName) ? "table-open" : "table-closed"}>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Redni broj vezbe</th>
                                        <th>Broj poena</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables[labName].points.map((points, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{points}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><strong>Ukupno:</strong></td>
                                        <td><strong>{tables[labName].totalPoints}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {entries.length > 0 ? (
                renderTables()
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

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