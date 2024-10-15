import React, { useState } from 'react';
import Squeeze from '@animated-burgers/burger-squeeze';
import '@animated-burgers/burger-squeeze/dist/styles.css'; // Ensure styles are imported
import { Link } from 'react-router-dom';
import './css/HamburgerMenu.css';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log('Menu isOpen state:', !isOpen); // Debugging purpose
  };

  return (
    <div className="hamburger-container">
      <Squeeze
        isOpen={isOpen}
        onClick={handleToggle}
        color="#ffffff" // White color for visibility on black background
        className="burger-icon"
      />
      {isOpen && (
        <nav className="hamburger-menu">
          <ul>
            <li>
              <Link to="/" onClick={handleToggle}>Home</Link>
            </li>
            <li>
              <Link to="/instructions" onClick={handleToggle}>Instructions</Link>
            </li>
            <li>
              <Link to="/preferences" onClick={handleToggle}>Preferences</Link>
            </li>
            <li>
              <Link to="/color-game" onClick={handleToggle}>Color Game</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default HamburgerMenu;
