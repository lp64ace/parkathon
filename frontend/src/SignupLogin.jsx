import React, {useState} from 'react';
import './SignupLogin.css';

import user_icon from './assets/user.png';
import password_icon from './assets/password.png';
import email_icon from './assets/email.png';

import { login, signup } from './api/user';

function SignupLogin() {

    const [action, setAction] = useState("Sign Up");
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (action === "Login") {
            try {
                await login({ email: form.email, password: form.password });
                alert("Login successful!");
            } catch (error) {
                alert("Login failed!");
            }
        } else if (action === "Sign Up") {
            try {
                await signup({ name: form.name, email: form.email, password: form.password });
                alert("Sign Up successful!");
            } catch (error) {
                alert("Sign Up failed!");
            }
        }
    };

    return (
        <div className = 'container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <form className="inputs" onSubmit={handleSubmit}>
                {action === "Login" ? <div></div> : <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                </div>}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                </div>
                <button type="submit" className="submit">Submit</button>
            </form>
            <div className="options-container">
                <div className={action === "Login" ? "options gray" : "options"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action === "Sign Up" ? "options gray" : "options"} onClick={()=>{setAction("Login")}}>Log In</div>
            </div>
        </div>
    );
}

export default SignupLogin;