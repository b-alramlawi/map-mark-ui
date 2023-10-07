import React, {useState} from 'react';
import '../../styles/pages/authentication/ForgotPasswordStyle.css'; // Import the CSS for styling
import SuccessMessage from "../../components/SuccessMessage"; // Import the SuccessMessage component
import FailedMessage from "../../components/FailedMessage"; // Import the FailedMessage component

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSendingEmail(true);

        // Add your logic here to send a password reset email
        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            if (response.status === 200) {
                setMessage('Password reset email sent successfully.');
                // Clear the email input field
                setEmail('');
            } else {
                setMessage('Error sending password reset email. Please try again.');
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setMessage('Internal server error. Please try again later.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <div className="forgot-password-container" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="forgot-password-form">
                <h2 className="form-title">Forgot Password</h2>
                {message && (
                    message === 'Password reset email sent successfully.' ? (
                        <SuccessMessage message={message}/>
                    ) : (
                        <FailedMessage message={message}/>
                    )
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isSendingEmail}>
                        {isSendingEmail ? 'Sending Email...' : 'Send Reset Email'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;


