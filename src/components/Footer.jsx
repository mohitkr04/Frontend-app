import React from 'react';

const Footer = ({ isDarkMode }) => {
    return (
        <div style={{ 
            backgroundColor: 'transparent', // Remove footer background color
            color: isDarkMode ? 'white' : 'white', // Change text color based on mode
            padding: '10px', // Adjust padding as needed
            textAlign: 'center', // Center the text
            position: 'relative', // Change position to fixed
            width: '100%', // Full width
            bottom: 0 // Stick to the bottom
        }}>
            © 2024 Indian AI Law
        </div>
    );
};

export default Footer;
