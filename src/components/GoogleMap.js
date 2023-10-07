import React, {useState, useEffect, useCallback} from 'react';
import {GoogleMap, LoadScript, Marker, InfoWindow, Circle} from '@react-google-maps/api';
import '../styles/components/GoogleMapStyle.css';

const containerStyle = {
    width: '100%',
    height: '90vh',
};

const center = {
    lat: 30.046981762780838,
    lng: 31.237174094852456,
};

function MyGoogleMap() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const [markers, setMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [isAddingBookmark, setIsAddingBookmark] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedMarkerForDeletion, setSelectedMarkerForDeletion] = useState(null);

    const fetchBookmarks = useCallback(() => {
        fetch(`http://localhost:3000/api/auth/bookmarks/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status.statusCode === 200) {
                    const userBookmarks = data.data.map((bookmark) => ({
                        lat: bookmark.coordinates.latitude,
                        lng: bookmark.coordinates.longitude,
                        name: bookmark.name,
                        description: bookmark.description,
                        bookmarkId: bookmark._id,
                    }));
                    setMarkers(userBookmarks); // Set markers from the database
                    console.log("This I my Data: ", userBookmarks);
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [userId, token]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const currentLocationMarker = {lat, lng, name: 'Current Location', description: 'You are here'};
                setMarkers([currentLocationMarker]);
            });
        }

        fetchBookmarks();
    }, [userId, token]);

    const toggleBookmarkMode = () => {
        setIsAddingBookmark(!isAddingBookmark);
        setSelectedMarkerForDeletion(null);
        setIsDeleteMode(false); // Turn off Delete Mode when switching to Add Mode
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedMarkerForDeletion(null); // Clear selected marker when entering Delete Mode
    };

    const handleMapClick = (event) => {
        if (isAddingBookmark) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const newMarker = {lat, lng, name: '', description: ''};
            setMarkers([...markers, newMarker]);
        }
    };

    const handleMarkerClick = (marker) => {
        if (isDeleteMode) {
            setSelectedMarkerForDeletion(marker); // Select marker for deletion
        } else {
            setActiveMarker(marker);
        }
    };

    const deleteSelectedMarker = async () => {
        if (selectedMarkerForDeletion && selectedMarkerForDeletion.bookmarkId) {
            const bookmarkId = selectedMarkerForDeletion['bookmarkId'];
            console.log('Bookmark ID:', bookmarkId);

            try {
                const response = await fetch(`http://localhost:3000/api/auth/bookmarks/${userId}/${bookmarkId}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    body: JSON.stringify({bookmarkId}), // Send the bookmarkId in the request body
                });

                if (response.status === 204) {
                    console.log('Bookmark deleted successfully');
                    setMarkers(markers.filter((marker) => marker !== selectedMarkerForDeletion));
                    setSelectedMarkerForDeletion(null);

                    // Close the InfoWindow programmatically
                    const closeButton = document.querySelector('.gm-ui-hover-effect'); // This class may vary depending on your Google Maps version
                    if (closeButton) {
                        closeButton.click();
                    }
                } else {
                    console.error('Error deleting bookmark');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleNameChange = (event) => {
        setActiveMarker({...activeMarker, name: event.target.value});
    };

    const handleDescriptionChange = (event) => {
        setActiveMarker({...activeMarker, description: event.target.value});
    };

    const saveBookmark = async () => {
        if (!activeMarker || !activeMarker.name) {
            return;
        }

        const bookmarkToSend = {
            userId,
            name: activeMarker.name,
            coordinates: {latitude: activeMarker.lat, longitude: activeMarker.lng},
            description: activeMarker.description,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/auth/bookmarks/${userId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(bookmarkToSend),
            });

            if (response.status === 201) {
                console.log('Bookmark created successfully');
                setMarkers([...markers, {...bookmarkToSend, bookmarkId: response.data.bookmarkId}]);
                setActiveMarker(null);
                setIsAddingBookmark(false);
            } else {
                console.error('Error creating bookmark');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyC3phyjN4feKgzWWAVQOURiVIkvYlSMWLg">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14} onClick={handleMapClick}>
                {markers.map((marker, index) => (
                    <React.Fragment key={index}>
                        <Marker
                            position={{lat: marker.lat, lng: marker.lng}}
                            onClick={() => handleMarkerClick(marker)}
                        />
                        <Circle
                            center={{lat: marker.lat, lng: marker.lng}}
                            radius={1000} // Adjust the radius as needed
                            options={{
                                fillColor: 'rgba(0, 0, 255, 0.2)', // Circle fill color
                                strokeColor: 'blue', // Circle border color
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }}
                        />
                    </React.Fragment>
                ))}

                {activeMarker && (
                    <InfoWindow
                        position={{lat: activeMarker.lat, lng: activeMarker.lng}}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div className="info-window-content">
                            <input
                                type="text"
                                placeholder="Bookmark Name"
                                value={activeMarker.name}
                                onChange={handleNameChange}
                                className="input-field"
                            />
                            <textarea
                                placeholder="Bookmark Description"
                                value={activeMarker.description}
                                onChange={handleDescriptionChange}
                                className="input-field"
                            />
                            <button className="save-button" onClick={saveBookmark}>
                                Save Bookmark
                            </button>
                        </div>
                    </InfoWindow>
                )}

                {selectedMarkerForDeletion && (
                    <InfoWindow
                        position={{lat: selectedMarkerForDeletion.lat, lng: selectedMarkerForDeletion.lng}}
                        onCloseClick={() => setSelectedMarkerForDeletion(null)}
                    >
                        <div className="info-window-container">
                            <div className="info-window-content">
                                <p>Do you want to delete this bookmark?</p>
                                <div className="button-container">
                                    <button className="button" onClick={deleteSelectedMarker}>Yes, Delete</button>
                                    <button className="button"
                                            onClick={() => setSelectedMarkerForDeletion(null)}>Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </InfoWindow>
                )}

                <div className="buttons-container">
                    <button
                        className={`add-bookmark-button ${isAddingBookmark ? 'adding' : ''}`}
                        onClick={toggleBookmarkMode}
                    >
                        {isAddingBookmark ? 'Cancel Bookmark' : 'Add Bookmark'}
                    </button>
                    <button
                        className={`delete-bookmark-button ${isDeleteMode ? 'deleting' : ''}`}
                        onClick={toggleDeleteMode}
                    >
                        {isDeleteMode ? 'Cancel Delete' : 'Delete Bookmark'}
                    </button>
                </div>
            </GoogleMap>
        </LoadScript>
    );
}

export default MyGoogleMap;
