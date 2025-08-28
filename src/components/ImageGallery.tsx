import React from 'react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <div className="image-gallery">
            <h3>Generated Images</h3>
            {images.length > 0 ? (
                <div className="image-grid">
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img 
                                src={image} 
                                alt={`Generated image ${index + 1}`}
                                onError={(e) => {
                                    // Handle image load errors
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTAuNTk0IDcwIDgyLjc4NiA3Ny44MDggODIuNzg2IDg3LjIxNEM4Mi43ODYgOTYuNjIgOTAuNTk0IDEwNC40MjggMTAwIDEwNC40MjhDMTA5LjQwNiAxMDQuNDI4IDExNy4yMTQgOTYuNjIgMTE3LjIxNCA4Ny4yMTRDMTE3LjIxNCA3Ny44MDggMTA5LjQwNiA3MCAxMDAgNzBaIiBmaWxsPSIjOTQ5N0E0Ii8+CjxwYXRoIGQ9Ik02MC43MTQgMTMwSDEzOS4yODZDMTQxLjQ5NyAxMzAgMTQzLjI4NiAxMzEuNzg5IDE0My4yODYgMTM0VjE0MEMxNDMuMjg2IDE0Mi4yMTEgMTQxLjQ5NyAxNDQgMTM5LjI4NiAxNDRINjAuNzE0QzU4LjUwMyAxNDQgNTYuNzE0IDE0Mi4yMTEgNTYuNzE0IDE0MFYxMzRDNTYuNzE0IDEzMS43ODkgNTguNTAzIDEzMCA2MC43MTQgMTMwWiIgZmlsbD0iIzk0OTdBNCIvPgo8L3N2Zz4K';
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No images to display.</p>
            )}
        </div>
    );
};

export default ImageGallery;