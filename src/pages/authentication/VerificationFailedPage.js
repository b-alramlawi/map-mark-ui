import React from 'react';
import '../../styles/pages/authentication/VerificationFailedStyle.css'; // Import the same styles

function NotFoundPage() {
    return (
        <div className="not-found-container" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="not-found-message">
                <h2 className="not-found-title">404 Not Found</h2>
                <p className="not-found-text">Oops, the page you are looking for does not exist.</p>
                <a href="/login" className="not-found-button">Go Login</a>
            </div>
        </div>
    );
}

export default NotFoundPage;
