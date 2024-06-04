import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import '../styles/LoginSignup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import userImg from '../images/person.png';
import emailImg from '../images/email.png';
import passwordImg from '../images/password.png';

import DropdownButton from "react-bootstrap/DropdownButton";
import { Dropdown } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
//import backgroundImg from '../images/loginBackground.jpg';


//msLogin shit
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { InteractionType } from '@azure/msal-browser';



const LoginSignup = () => {

    //const [action, setAction] = useState("Sign Up");

    const initialValues = {email: "", password: "", name:"",lastName:"", modul:"", index:"", DoB:"", Ddiplomiranja:"", Fdiplomiranja:"", Ddoktoriranja:"", Fdoktoriranja:""};

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [action, setAction] = useState("Login");
    const [typeOfUser, setTypeOfUser] = useState("student");
    const navigate = useNavigate();

    //msLogin (izbaci ga kad budes imao vremena)
    const { instance, accounts } = useMsal();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
        console.error(e);
        setIsLoggedIn(true);
        });
    };

    const getUserDetails = () => {
        if (accounts.length > 0) {
        const account = accounts[0];
        return (
            <div>
            <p style={{fontWeight: 'bold'}}>User Details</p>
            <p>Username: {account.idTokenClaims.name}</p>
            <p>Email: {account.username}</p>
            </div>
        );
        }
        return null;
    };
    //end of msLogin

    const postValues = async () => {
        if (Object.keys(formErrors).length === 0) {
            console.log(formValues);
            console.log(JSON.stringify(formValues));
            console.log("success!");
            try {
                await fetch('http://127.0.0.1:1738/studentSignUp', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        formValues
                    )
                    })
            } catch (err) {
                console.log("Error: ", err);
            }
        }
    }

    const handleChange = (e) => {

        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const fetchStudent = async (Email) => {
        try {
            console.log(Email);
            const response = await fetch(`http://127.0.0.1:1738/user/filteredFind`, {
                method: "POST",
                body: JSON.stringify({email: Email}),
                headers: {"Content-Type": "application/json"}
            });


            if (response.status != 200 && response.status != 404) {
                throw new Error('Failed to fetch data jbg');
            }
            const data = await response.json();

            if (response.status == 404) {
                console.log("nema ga taj lik");
            }
            if (response.status == 200){
                console.log("hoce vljd", data);
                localStorage.setItem('userData', JSON.stringify(data));
                navigate(`/${data.privileges}`);  // Redirect to the page named like data.privileges
                
            }
            return data;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const handleSubmit = (e) => {
        
        e.preventDefault();
        var errorList = validate(formValues);
        setFormErrors(errorList);
        if (Object.keys(errorList).length === 0) {
            //console.log(formValues);
            // console.log(JSON.stringify(formValues));
            console.log("success! pressed submit and input fields are adequate");
            //ovde sada treba da se pozove fetch ka serveru
        }
        else {
            console.log("submit failed, input fields")
        };
    }

    useEffect( () => {
        console.log("nije logovan");
    },[formErrors])

    const validate = (values) => {
        const errors = {};
        const regex = /^(?!\s)[A-Z0-9\s]+$/i;

        for (let key in values) {

            if (action=="Login"){
                if (key == "email" || key == "password")
                    if (!values[key]) {
                        errors[key] = `${key} is required!`;
                    }
            }
            else if (typeOfUser=="student"){
                if (key != "Ddiplomiranja" && key != "Fdiplomiranja" && key != "Ddoktoriranja" && key != "Fdoktoriranja")
                    if (!values[key]) {
                        errors[key] = `${key} is required!`;
                    }
            }
            else if (typeOfUser=="assistant"){
                if (key != "Dob" && key != "index" && key!="Ddoktoriranja" && key!="Fdoktoriranja")
                    if (!values[key]) {
                        errors[key] = `${key} is required!`;
                    }
            }
            else if (typeOfUser=="professor"){
                if (key != "Dob" && key != "index") {
                    if (!values[key]) {
                        errors[key] = `${key} is required!`;
                    }
                }
            }else if (typeOfUser=="admin"){
                if (key == "email" || key == "password" || key=="name" || key=="lastName")
                    if (!values[key]) {
                        errors[key] = `${key} is required!`;
                    }
            }
        }

        return errors;
    }

    const showInputFields = () => {
        return (
            <div className='inputs'>
                <div className='input'>
                    <img src={emailImg} alt=''></img>
                    <input type='email' name='email' placeholder='Email' value = {formValues.email} onChange={handleChange}></input>
                </div>
                <p>{formErrors.email}</p>
                <div className='input'>
                    <img src={passwordImg} alt='' ></img>
                    <input type='password' name='password' placeholder='Password' value = {formValues.password} onChange={handleChange}></input>
                </div>
                <p>{formErrors.password}</p>

                {action!="Sign Up"? <></> : <>
                    <div className='input'>
                        <img src={userImg} alt='' ></img>
                        <input type='text' name='name' placeholder='Name' value = {formValues.name} onChange={handleChange}></input>                        
                    </div>
                    <p>{formErrors.name}</p>

                    <div className='input'>
                        <img src={userImg} alt='' ></img>
                        <input type='text' name='lastName' placeholder='LastName' value = {formValues.lastName} onChange={handleChange}></input>                        
                    </div>
                    <p>{formErrors.lastName}</p>

                    {typeOfUser=="admin"? <></>: <>
                        <div className='input'>
                            <img src={userImg} alt='' ></img>
                            <input type='text' name='modul' placeholder='modul' value = {formValues.modul} onChange={handleChange}></input>                        
                        </div>
                        <p>{formErrors.modul}</p>

                        {typeOfUser=="student"? <>
                            <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input type="number" name='index' placeholder='index' value = {formValues.index} onChange={handleChange}></input>                        
                            </div>
                            <p>{formErrors.index}</p>

                            <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
                                        onBlur={(e) => (e.target.type = "text")} name='DoB' placeholder='datum rodjenja' value = {formValues.DoB} onChange={handleChange}></input>                        
                            </div>
                            <p>{formErrors.DoB}</p>
                        </>:
                        <>
                            <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
                                        onBlur={(e) => (e.target.type = "text")} name='Ddiplomiranja' placeholder='datum diplomiranja' value = {formValues.Ddiplomiranja} onChange={handleChange}></input>                        
                            </div>
                            <p>{formErrors.Ddiplomiranja}</p>

                            <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input type="text" name='Fdiplomiranja' placeholder='fakultet diplomiranja' value = {formValues.Fdiplomiranja} onChange={handleChange}></input>                        
                            </div>
                            <p>{formErrors.Fdiplomiranja}</p>

                            {typeOfUser!="professor"?<></> :
                            <>
                                <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
                                        onBlur={(e) => (e.target.type = "text")} placeholder="datum doktoriranja" name='Ddoktoriranja' value = {formValues.Ddoktoriranja} onChange={handleChange}></input>                        
                                </div>
                                <p>{formErrors.Ddoktoriranja}</p>

                                <div className='input'>
                                <img src={userImg} alt='' ></img>
                                <input type="text" name='Fdoktoriranja' placeholder='fakultet doktoriranja' value = {formValues.Fdoktoriranja} onChange={handleChange}></input>                        
                                </div>
                                <p>{formErrors.Fdoktoriranja}</p>
                            </>}
                        </>}
                    </>}
                </>}
            </div>
        )
    }

    

    return (
        <>
        <div className='loginContainer'>
            {/* {Object.keys(formErrors).length === 0 && isSubmit ? (<div className="ui message success">Signed in successfully</div>) : 
            (<pre>{JSON.stringify(formValues)} </pre>
            )} */}
            <form>
            <div className='header'>
                <div className='text'>{action=="Login"?<>Login</>: <>Sign Up</>}</div>
                <div className='underline'></div>
            </div>
            <div className='submit-container'>
                <Button variant="primary" onClick={()=>{setAction("Login")}}>Login</Button>
                <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                    <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("student")}}>student</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("assistant")}}>assistant</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("professor")}}>professor</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("admin")}}>admin</Dropdown.Item>
                </DropdownButton>
            </div>

            {showInputFields()}
            
            <div style={{padding:"20px", float:"right"}}>
                <Button variant="primary" onClick={handleSubmit}>Submit dugme</Button>    
            </div>
            </form>            
        </div>
        </>
    )
}

export default LoginSignup;