import React from 'react';
import '../styles/pages/HomeStyle.css';
import Navbar from '../components/Navbar';
import MyGoogleMap from '../components/GoogleMap';

function HomePage() {
    return (
        <div className="home-container">
            <Navbar className="navbar"/>
            <div className="map-container">
                <MyGoogleMap/>
            </div>

        </div>
    );
}

export default HomePage;


