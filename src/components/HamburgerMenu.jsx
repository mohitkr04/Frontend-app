import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Importing hamburger icon

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        console.log("Menu toggled");  // Debugging if menu is being clicked
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Hamburger Icon */}
            <div className="hamburger-icon" onClick={toggleMenu}>
                <FaBars size={30} />
            </div>

            {/* Dropdown Menu */}
            <nav className={`menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="#signup">Sign Up</a></li>
                    <li><a href="#login">Log In</a></li>
                    <li><a href="#api">API</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                </ul>
            </nav>

            {/* Add some styling */}
            <style jsx>{`
                .hamburger-icon {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    cursor: pointer;
                    z-index: 1000;
                    background-color: yellow; /* Temporary */
                }
                .menu {
                    position: fixed;
                    top: 0;
                    right: -250px;
                    height: 100%;
                    width: 250px;
                    background-color: blue; /* Temporary */
                    transition: right 0.3s ease;
                    z-index: 999;
                }
                .menu.open {
                    right: 0;
                }
                .menu ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 50px 0 0 0;
                }
                .menu li {
                    padding: 20px;
                    text-align: center;
                }
                .menu li a {
                    color: white;
                    text-decoration: none;
                    font-size: 18px;
                }
                .menu li a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default HamburgerMenu;
