import React from 'react';
import '../styles/components/FailedMessageStyle.css'; // Import the CSS for styling

function FailedMessage({message}) {
    return (
        <div className="failed-message">
            <p className="message-text">{message}</p>
        </div>
    );
}

export default FailedMessage;
