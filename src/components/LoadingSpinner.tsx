import React from 'react';

interface LoadingSpinnerProps {
    status?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ status = 'Generation in progress...' }) => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{status}</p>
        </div>
    );
};

export default LoadingSpinner;