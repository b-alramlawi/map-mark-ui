import React, {useState} from 'react';
import '../../styles/pages/authentication/SignUpStyle.css';
import SuccessMessage from "../../components/SuccessMessage";
import FailedMessage from "../../components/FailedMessage";
import {useHistory} from 'react-router-dom';

function SignUpPage() {
    const history = useHistory(); // Initialize useHistory

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });

    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(null);
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsRegistering(true);
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Registration successful
                setRegistrationSuccess(true);
                console.log('Registration successful');

                // Delay the redirection by 2 seconds
                setTimeout(() => {
                    history.push('/home');
                }, 2000);
            } else {
                // Registration failed
                setRegistrationSuccess(false);
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setRegistrationSuccess(false);
        } finally {
            setIsRegistering(false);
        }
    };


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    return (
        <div className="signup-container" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="signup-form">
                <h2 className="form-title">Signup</h2>
                {registrationSuccess === true && (
                    <SuccessMessage message="Registration successful!"/>
                )}
                {registrationSuccess === false && (
                    <FailedMessage message="Registration failed. Please try again."/>
                )}
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
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isRegistering}>
                        {isRegistering ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default SignUpPage;
