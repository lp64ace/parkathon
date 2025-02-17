import React, {useState} from 'react';
import './SignupLogin.css';

import user_icon from './assets/user.png';
import password_icon from './assets/password.png';
import email_icon from './assets/email.png';

function SignupLogin() {

    const [action, setAction] = useState("Sign Up");

    return (
        <div className = 'container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> : <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name"/>
                </div>}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>
            </div>
            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={()=>{setAction("Login")}}>Log In</div>
            </div>
        </div>
    );
}

export default SignupLogin;