import React from 'react';
import '../styles/pages/NotFoundStyle.css'; // Import the same styles

function NotFoundPage() {
    return (
        <div className="email-verification-container"
             style={{backgroundImage: `url(${process.env.PUBLIC_URL}/map.png)`}}>
            <div className="email-verification-message">
                <h2 className="error-title">404 Not Found</h2>
                <p className="error-text">Oops, the page you are looking for does not exist.</p>
                <a href="/login" className="home-button">Go Login</a>
            </div>
        </div>
    );
}

export default NotFoundPage;
