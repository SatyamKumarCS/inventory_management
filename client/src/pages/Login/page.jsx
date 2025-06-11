import { useState } from 'react';
import "./style.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email,
                password
            })
            console.log(response.data);
            //   alert(response.data.message);
            navigate('/dashboard')

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");
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
                    <h2>Log in to your account</h2>
                    <p>Welcome back! Please enter your details.</p>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)} />
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)} />
                        <div className="options">
                            <label>
                                <input type="checkbox" /> Remember for 30 days
                            </label>
                            <a href="#">Forgot password</a>
                        </div>
                        <button type="submit" className="btn-primary">Sign in</button>
                        <button type="button" className="btn-google">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                                alt="Google Logo"
                            />
                            Sign in with Google
                        </button>
                    </form>
                    <p className="signup-text">
                        Don’t have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
