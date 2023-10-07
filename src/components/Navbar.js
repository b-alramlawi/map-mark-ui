import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import '../styles/components/NavbarStyle.css';

function Navbar() {
    const history = useHistory();

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('authToken');

    // State to track the loading status
    const [loading, setLoading] = useState(false);

    // Function to handle logout
    const handleLogout = () => {
        // Show the loading animation
        setLoading(true);

        // Simulate a delay (you can replace this with your actual logout logic)
        setTimeout(() => {
            // Clear the authentication token from localStorage
            localStorage.removeItem('authToken');

            // Hide the loading animation
            setLoading(false);

            // Redirect to the login page
            history.push('/login');
        }, 2000); // Simulated 2-second delay for the loading animation
    };

    return (<nav className="navbar">
        <div className="navbar-container">
            <Link to="/" className="navbar-logo">
                Map Mark
            </Link>
            <ul className="navbar-menu">
                <li className="navbar-item">
                    <a href="/home" className="navbar-link">
                        Home
                    </a>
                </li>
                <li className="navbar-item">
                    <a href="/profile" className="navbar-link">
                        Profile
                    </a>
                </li>
                {isAuthenticated ? (<li className="navbar-item">
                    {loading ? (<span>Loading...</span> // Display loading message or animation
                    ) : (<a href="/login" className="navbar-link" onClick={handleLogout}>
                        Logout
                    </a>)}
                </li>) : null}
            </ul>
        </div>
    </nav>);
}

export default Navbar;
