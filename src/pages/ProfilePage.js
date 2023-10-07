import React, {useState, useEffect} from 'react';
import '../styles/pages/ProfileStyle.css';
import Navbar from '../components/Navbar';

function ProfilePage() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    console.log("USER ID", userId);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        username: '',
        isVerified: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setStatus('');

        fetch(`http://localhost:3000/api/auth/profile/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);

                if (data.status.statusCode === 200) {
                    setUserData(data.data);
                } else {
                    setStatus('Error fetching user data');
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setStatus('Error fetching user data');
                console.error('Error fetching user data:', error);
            });
    }, [userId, token]);

    const handleSaveClick = () => {
        setIsLoading(true);
        setStatus('');

        fetch(`http://localhost:3000/api/auth/update-profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({userData}),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);

                if (data.status.statusCode === 200) {
                    setStatus('Profile updated successfully');
                } else {
                    setStatus('Error updating profile');
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setStatus('Error updating profile');
                console.error('Error updating profile:', error);
            });

    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };


    return (
        <div className="profile-container">
            <Navbar/>
            <div className="profile-card">
                <div className="profile-header">
                    <img
                        src={process.env.PUBLIC_URL + '/profile.png'}
                        alt="ProfilePage"
                        className="profile-image"
                    />
                    <h2 className="profile-title">User Information</h2>
                </div>
                <div className={`status-rectangle ${userData.isVerified ? 'verified' : 'not-verified'}`}>
                    {userData.isVerified ? 'Verified' : 'Not Verified'}
                </div>
                <div className="profile-info">
                    <div className="profile-item">
                        <label className="profile-label">Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="profile-input"
                            disabled={!isEditing || isLoading}
                        />
                    </div>
                    <div className="profile-item">
                        <label className="profile-label">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            className="profile-input"
                            disabled={!isEditing || isLoading}
                        />
                    </div>
                    <button
                        className={isEditing ? "profile-save-button" : "profile-edit-button"}
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : (isEditing ? "Save" : "Edit")}
                    </button>
                    {status && <div className="status-message">{status}</div>}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
