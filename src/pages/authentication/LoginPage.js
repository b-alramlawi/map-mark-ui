import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../../styles/pages/authentication/LoginStyle.css';
import SuccessMessage from "../../components/SuccessMessage";
import FailedMessage from "../../components/FailedMessage";

function LoginPage() {
    const history = useHistory(); // Initialize useHistory

    const [formData, setFormData] = useState({
        email: '', password: '',
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoggingIn(true);
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Login successful
                const data = await response.json(); // Parse response data
                setLoginSuccess(true);
                console.log('Login successful');

                // Store the token in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userId', data.data._id.toString());


                // Delay the redirection by 2 seconds
                setTimeout(() => {
                    history.push('/home');
                }, 2000);
            } else {
                // Login failed
                setLoginSuccess(false);
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoginSuccess(false);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    return (<div className="login-container" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
        <div className="login-form">
            <h2 className="form-title">Login</h2>
            {loginSuccess === true && (<SuccessMessage message="Login successful!"/>)}
            {loginSuccess === false && (<FailedMessage message="Login failed. Please try again."/>)}
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="forgot-password-link">
                    <a href="/forgot-password" className="forgot-password-text">
                        Forgot Password?
                    </a>
                </div>
                <button type="submit" className="submit-button" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="login-link">
                Don't have an account? <a href="/signup">Signup</a>
            </p>
        </div>
    </div>);
}

export default LoginPage;
