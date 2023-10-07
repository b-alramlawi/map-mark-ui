// ResetPasswordPage.js
import React, {useState} from 'react';
import {useParams} from 'react-router-dom'; // Import useParams to capture URL parameters
import '../../styles/pages/authentication/ResetPasswordStyle.css';
import SuccessMessage from "../../components/SuccessMessage"; // Import the SuccessMessage component
import FailedMessage from "../../components/FailedMessage"; // Import the FailedMessage component
import {useHistory} from 'react-router-dom';

function ResetPasswordPage() {
    const history = useHistory(); // Initialize useHistory
    const {token} = useParams(); // Capture the 'token' parameter from the URL
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Make an API call to reset the password using the 'token' from the URL
            const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({newPassword}),
            });

            if (response.status === 200) {
                setMessage('Password reset successful.');
                // Clear the password input field
                setNewPassword('');

                // Delay the redirection by 2 seconds
                setTimeout(() => {
                    history.push('/login');
                }, 2000);

            } else {
                setMessage('Error resetting password. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Internal server error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reset-password-container" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="reset-password-form">
                <h2 className="form-title">Reset Password</h2>
                {message && (
                    message === 'Password reset successful.' ? (
                        <SuccessMessage message={message}/>
                    ) : (
                        <FailedMessage message={message}/>
                    )
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="new-password">New Password:</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;


