import React, { useState } from 'react';
import "./style.css";
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate=useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/register', {
                name,
                email,
                password
            });
            console.log(response.data)
            // alert(response.data.message)
            navigate('/')
        } catch (error) {
            console.error(error.response?.data || error.message)
            alert(error.response?.data?.message || "Registration failed")
        }
    };

    return (
        <div className="container">
            <div className="left-panel">
                <div className="logo">
                    <img src="../../../full logo.png" alt="Countrees Logo" />
                </div>
            </div>

            <div className="right-panel">
                <div className="form-container">
                    <img src="../../../icon.png" alt="Mini Logo" className="mini-logo" />
                    <h2>Create an account</h2>
                    <p>Start your inventory management now!</p>
                    <form onSubmit={handleSubmit}>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create your Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="form-note">Must be at least 8 characters.</div>

                        <button type="submit" className="btn-primary">Getting Started</button>

                        <button type="button" className="btn-google">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                                alt="Google Logo"
                            />
                            Sign Up with Google
                        </button>
                    </form>

                    <p className="signup-text">
                        Already have an account? <Link to="/">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
