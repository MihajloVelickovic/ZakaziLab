//import { Link, NavLink } from 'react-router-dom';
import React, {useState} from "react";
import '../styles/Student.css';


import NavigationBar from "./NavigationBar";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from 'react-router-dom';
import StudentHome from "./StudentHome";
import LaboratorijskaVezba from "./LaboratorijskaVezba";
import OsvojeniPoeni from "./OsvojeniPoeni";
import KalendarAktivnosti from "./KalendarAktivnosti";

// export const removeSlashSuffix = (input)  => {
//     if (input.charAt(input.length - 1) === "/") {
//         return input.substr(0, input.length - 1)
//     } else {
//         return input;
//     }
// }


const Student = () => {

    //const [action, setAction] = useState("Login");

    return (
        <div className="studentContainer">
            <aside>
                <NavigationBar />
            </aside>
            <main>
                <Routes>
                    <Route path="home" element={<StudentHome />} />
                    <Route path="lab" element={<LaboratorijskaVezba />} />
                    <Route path="poeni" element={<OsvojeniPoeni />} />
                    <Route path="aktivnosti" element={<KalendarAktivnosti />} />
                </Routes>
            </main>
            
        </div>
    )
}

export default Student;

/*
<aside>
                <h2>Working on this</h2>
                <Router>
                    <NavigationBar />
                    <Switch>
                        <Route exact path='/' component={StudentHome}/>
                        <Route path='/lab' component={LaboratorijskaVezba}/>
                        <Route path='/poeni' component={OsvojeniPoeni}/>
                        <Route path='/aktivnosti' component={KalendarAktivnosti}/>
                    </Switch>
                </Router>
            </aside>
            <main>
                <h2>Something in main</h2>
                <br></br>
                <h3>Work in progress bro</h3>
                <Button>Useless bootstrap button</Button>
                <p>I should maybe reduce the width of main</p>
            </main>
*/