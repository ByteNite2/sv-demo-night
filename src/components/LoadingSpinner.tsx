import React from 'react';
import './LoadingSpinner.css'; // Assuming you have a CSS file for styling the spinner

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Generation in progress...</p>
        </div>
    );
};

export default LoadingSpinner;