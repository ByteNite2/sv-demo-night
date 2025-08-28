import React from 'react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <div className="image-gallery">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <div key={index} className="image-item">
                        <img src={image} alt={`Generated ${index}`} />
                    </div>
                ))
            ) : (
                <p>No images to display.</p>
            )}
        </div>
    );
};

export default ImageGallery;