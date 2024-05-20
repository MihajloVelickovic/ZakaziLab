import { Link, NavLink } from 'react-router-dom';
import React, {useState} from "react";
import '../styles/LoginSignup.css';


import userImg from '../images/person.png';
import emailImg from '../images/email.png';
import passwordImg from '../images/password.png';

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action==="Login"?
                    <div></div>:
                    <div className='input'>
                        <img src={userImg} alt='' ></img>
                        <input type='text' placeholder='Name'></input>
                    </div>
                }
                <div className='input'>
                    <img src={emailImg} alt='' ></img>
                    <input type='email' placeholder='Email'></input>
                </div>
                <div className='input'>
                    <img src={passwordImg} alt='' ></img>
                    <input type='password' placeholder='Password'></input>
                </div>
            </div>
            {action==="Sign Up"?<div></div>:
                <div className="forgot-password">Do you have Alzheimer's? <span>Here's the cure</span></div>
            }            
            <div className='submit-container'>
                <div className={action==="Login"?'submit-gray':'submit'} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==="Sign Up"?'submit-gray':'submit'} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>

    )
}

export default LoginSignup;