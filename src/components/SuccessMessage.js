import React from 'react';
import '../styles/components/SuccessMessageStyle.css';

function SuccessMessage({message}) {
    return (
        <div className="success-message">
            <p className="message-text">{message}</p>
        </div>
    );
}

export default SuccessMessage;
