import React, { useState, useEffect } from 'react';
import { loadColorPreferences, saveColorPreferences } from './utils';
import './css/PreferencesPage.css';

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

function PreferencesPage() {
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    // Load saved preferences or default if missing/corrupt
    const preferences = loadColorPreferences();
    setSelectedColors(preferences);
  }, []);

  const handleColorToggle = (color) => {
    setSelectedColors((prevState) => ({
      ...prevState,
      [color]: !prevState[color],
    }));
  };

  const handleSavePreferences = () => {
    saveColorPreferences(selectedColors);
    alert('Preferences saved successfully!');
  };

  return (
    <div className="PreferencesPage">
      <h2>Choose your colors:</h2>
      <p>The same color might appear multiple times in a row. This is by design.</p>
      <div className="color-list">
        {Object.keys(colors).map((color) => (
          <div key={color} className="color-item">
            <div
              className="color-checkbox-container"
              style={{ backgroundColor: colors[color] }}
            >
              <input
                type="checkbox"
                checked={!!selectedColors[color]}
                onChange={() => handleColorToggle(color)}
                className="color-checkbox"
              />
            </div>
            <span>{color}</span>
          </div>
        ))}
      </div>
      <button onClick={handleSavePreferences} className="save-button">
        Save
      </button>
    </div>
  );
}

export default PreferencesPage;
