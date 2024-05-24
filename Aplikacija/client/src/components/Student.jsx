//import { Link, NavLink } from 'react-router-dom';
import React, {useState} from "react";
import '../styles/Student.css';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const Student = () => {

    //const [action, setAction] = useState("Login");

    return (
        <div className="studentContainer">
            <aside>
                <h2>Something is aside</h2>
                <h3>Side bar should be here</h3>
            </aside>
            <main>
                <h2>Something in main</h2>
                <br></br>
                <h3>Work in progress bro</h3>
                <Button>Useless bootstrap button</Button>
                <p>I should maybe reduce the width of main</p>
            </main>
        </div>
    )
}

export default Student;