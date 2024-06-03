//import { Link, NavLink } from 'react-router-dom';
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
//import backgroundImg from '../images/loginBackground.jpg';


//msLogin shit
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { InteractionType } from '@azure/msal-browser';



const LoginSignup = () => {

    //const [action, setAction] = useState("Sign Up");

    const initialValues = {username:"", email: "", password: ""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    //msLogin
    const { instance, accounts } = useMsal();
    const [isLoggedIn, setIsLoggedIn] = useState(accounts.length>0);

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
        if (Object.keys(formErrors).length === 0 && isSubmit) {
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
        setFormErrors(validate(formValues));
        //setIsSubmit(true);
        //console.log("true submit");
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            //console.log(formValues);
            // console.log(JSON.stringify(formValues));
            console.log("success! pressed submit");
        }
        console.log("submit button pressed");
    }

    useEffect( () => {
        if (!isLoggedIn){
            console.log("nije logovan");
            handleLogin();
        }
            
        if (accounts.length > 0) {
            const account = accounts[0];
            var Username = account.idTokenClaims.name;
            var Email = account.username;
            var result = fetchStudent(Email);
            result.then(res => {
                console.log(res.name);
            })
        }
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            //console.log(JSON.stringify(formValues));
            console.log("success! pressed submit 2");
            //postValues();                                             //this is sending to server sign up details
        }
    },[formErrors])

    const validate = (values) => {
        const errors = {}
        const regex = /^(?!\s)[A-Z0-9\s]+$/i;
        if (!values.username) {
            errors.username = "Username is required!";
        }
        if (!values.email) {
            errors.email = "Email is required";
         }//else if (!regex.test(values.email)) {
        //     errors.email = "This is not a valid email format!";
        // }
        if (!values.password) {
            errors.password = "Password is required!";
        }else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        }
        return errors;
    }

    const DropdownButton = ({ title, items }) => {
        const [showMenu, setShowMenu] = useState(false);
    
        const toggleMenu = () => {
            setShowMenu(!showMenu);
        };
    
        const handleItemClick = (item) => {
            console.log(item); // Handle item click
            setShowMenu(false); // Close the menu
        };
    
        return (
            <div className="submit" onClick={toggleMenu}>
                {title} <i className="bi bi-caret-down" style={{paddingLeft: "25px"}}></i>
                <ul className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
                    {items.map((item, index) => (
                        <li key={index} className="dropdown-item" onClick={() => handleItemClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    

    return (
        <>
        <div className='loginContainer'>
            {/* {Object.keys(formErrors).length === 0 && isSubmit ? (<div className="ui message success">Signed in successfully</div>) : 
            (<pre>{JSON.stringify(formValues)} </pre>
            )} */}
            <form>
            <div className='header'>
                <div className='text'>Sign Up</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                    
                <div className='input'>
                    <img src={userImg} alt='' ></img>
                    <input type='text' name='username' placeholder='Name' value = {formValues.username} onChange={handleChange}></input>                        
                </div>
                <p>{formErrors.username}</p>
                <div className='input'>
                    <img src={emailImg} alt='' ></img>
                    <input type='email' name='email' placeholder='Email' value = {formValues.email} onChange={handleChange}></input>
                </div>
                <p>{formErrors.email}</p>
                <div className='input'>
                    <img src={passwordImg} alt='' ></img>
                    <input type='password' name='password' placeholder='Password' value = {formValues.password} onChange={handleChange}></input>
                </div>
                <p>{formErrors.password}</p>
            </div>
            {/* {action==="Sign Up"?<div></div>:
                <div className="forgot-password">Do you have Alzheimer's? <span>Here's the cure</span></div>
            }             */}
            <div className='submit-container'>
                {/* <div className={action==="Login"?'submit-gray':'submit'} onClick={()=>{setAction("Sign Up")}}>Sign Up</div> */}
                {/* <div className={action==="Sign Up"?'submit-gray':'submit'} onClick={()=>{setAction("Login")}}>Login</div> */}
                {/* <DropdownButton className='submit' onClick={() => { }} title="Sign Up">
                    <Dropdown.Item className='dropdown-item'>Action</Dropdown.Item>
                    <Dropdown.Item className='dropdown-item'>Another action</Dropdown.Item>
                    <Dropdown.Item className='dropdown-item'>Something else</Dropdown.Item>
                </DropdownButton> */}
                <DropdownButton title="Sign Up" items={["Action", "Another action", "Something else"]}></DropdownButton>
                <button className="submit" onClick={handleSubmit}> Submit dugme </button>
            </div>
            
            </form>            
        </div>
        </>
    )
}

export default LoginSignup;



// const onSubmit = async (values) => {
//         console.log("Values: ", values);
//         setError("");

//         try {
//             const response = await fetch('https://mywebsite.example/endpoint/', {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     firstParam: 'yourValue',
//                     secondParam: 'yourOtherValue',
//                 })
//                 })
//         } catch (err) {
//             console.log("Error: ", err);
//         }
//     };