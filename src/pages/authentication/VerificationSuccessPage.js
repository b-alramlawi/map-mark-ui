import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import '../../styles/pages/authentication/VerificationSuccessStyle.css';

function VerificationSuccessPage() {
    const history = useHistory();

    useEffect(() => {
        // Extract the verification token from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        // Make a POST request to your backend to update the user's status
        if (token) {
            fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`, {
                method: 'POST',
            })
                .then((response) => {
                    if (response.status === 200) {
                        console.log('Email verification successful.');
                        // You can redirect the user to the login page or any other page here
                        history.push('/v-success');
                    } else {
                        console.error('Email verification failed.');
                    }
                })
                .catch((error) => {
                    console.error('Error while verifying email:', error);
                });
        }
    }, [history]);

    return (
        <div className="email-verification-success-container"
             style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="email-verification-success-message">
                <h2 className="success-title">Email Verified</h2>
                <p className="success-text">Email verified successfully.</p>
                <a href="/login" className="home-button">Go Login</a>
            </div>
        </div>
    );

}

export default VerificationSuccessPage;
