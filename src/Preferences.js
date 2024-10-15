import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './css/Preferences.css';

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  yellow: '#FFD700',
  green: '#008000',
  blue: '#1E90FF',
  purple: '#6A5ACD',
  pink: '#FF00FF',
  red: '#DC143C',
  orange: '#FF7F50',
};

function Preferences() {
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    // Load saved preferences from cookies if available
    const savedPreferences = Cookies.get('selectedColors');
    if (savedPreferences) {
      try {
        setSelectedColors(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    } else {
      // Initialize with all colors selected
      const initialColors = {};
      Object.keys(colors).forEach((color) => {
        initialColors[color] = true;
      });
      setSelectedColors(initialColors);
    }
  }, []);

  const handleColorToggle = (color) => {
    setSelectedColors((prevState) => ({
      ...prevState,
      [color]: !prevState[color],
    }));
  };

  const handleSavePreferences = () => {
    Cookies.set('selectedColors', JSON.stringify(selectedColors), { expires: 365 });
    alert('Preferences saved successfully!');
  };

  return (
    <div className="Preferences">
      <h2>Choose your colors:</h2>
      <p>The same color might appear multiple times in a row. This is by design.</p>
      <div className="color-list">
        {Object.keys(colors).map((color) => (
          <label key={color} className="color-option" style={{ backgroundColor: colors[color] }}>
            <input
              type="checkbox"
              checked={selectedColors[color]}
              onChange={() => handleColorToggle(color)}
            />
            <span>{color}</span>
          </label>
        ))}
      </div>
      <button className="save-button" onClick={handleSavePreferences}>
        Save
      </button>
    </div>
  );
}

export default Preferences;
