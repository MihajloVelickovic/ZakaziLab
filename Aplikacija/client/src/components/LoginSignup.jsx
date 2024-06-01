//import { Link, NavLink } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import '../styles/LoginSignup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import userImg from '../images/person.png';
import emailImg from '../images/email.png';
import passwordImg from '../images/password.png';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
//import backgroundImg from '../images/loginBackground.jpg';

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");

    const initialValues = {username:"", email: "", password: ""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        //console.log("true submit");
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            //console.log(formValues);
            // console.log(JSON.stringify(formValues));
            // console.log("success!");
        }
    }

    useEffect( () => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            //console.log(JSON.stringify(formValues));
            console.log("success!");
            postValues();
        }
        // if (Object.keys(formErrors).length === 0 && isSubmit) {
        //     //console.log(formValues);
        //     // console.log(JSON.stringify(formValues));
        //     // console.log("success!");
        //     // try {
        //     //     await fetch('http://127.0.0.1:1738/studentSignUp', {
        //     //         method: 'POST',
        //     //         headers: {
        //     //             'Accept': 'application/json',
        //     //             'Content-Type': 'application/json',
        //     //         },
        //     //         body: JSON.stringify(
        //     //             formValues
        //     //         )
        //     //         })
        //     // } catch (err) {
        //     //     console.log("Error: ", err);
        //     // }

        // }
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

    return (
        <div className='loginContainer'>
            {/* {Object.keys(formErrors).length === 0 && isSubmit ? (<div className="ui message success">Signed in successfully</div>) : 
            (<pre>{JSON.stringify(formValues)} </pre>
            )} */}
            <form onSubmit={handleSubmit}>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action==="Login"?
                    <div></div>:
                    <>
                    
                    <div className='input'>
                        <img src={userImg} alt='' ></img>
                        <input type='text' name='username' placeholder='Name' value = {formValues.username} onChange={handleChange}></input>                        
                    </div>
                    <p>{formErrors.username}</p>
                    </>
                }
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
            {action==="Sign Up"?<div></div>:
                <div className="forgot-password">Do you have Alzheimer's? <span>Here's the cure</span></div>
            }            
            <div className='submit-container'>
                {/* <div className={action==="Login"?'submit-gray':'submit'} onClick={()=>{setAction("Sign Up")}}>Sign Up</div> */}
                <div className={action==="Sign Up"?'submit-gray':'submit'} onClick={()=>{setAction("Login")}}>Login</div>
                <DropdownButton className={action==="Sign Up"?'submit-gray':'submit'} onClick={()=>{setAction("Sign Up")}} title="Sign Up">
                    <Dropdown.Item >Action</Dropdown.Item>
                    <Dropdown.Item >Another action</Dropdown.Item>
                    <Dropdown.Item >Something else</Dropdown.Item>
                </DropdownButton>
            </div>
            <button type ="submit" className="submit"> Submit dugme</button>
            </form>            
        </div>
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