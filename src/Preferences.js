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
  const [accent, setAccent] = useState('american'); // Default accent
  const [gender, setGender] = useState('male'); // Default gender
  const [notification, setNotification] = useState(''); // Notification message

  useEffect(() => {
    const savedColors = Cookies.get('selectedColors');
    const savedAccent = Cookies.get('accent');
    const savedGender = Cookies.get('gender');

    if (savedColors) {
      try {
        setSelectedColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    } else {
      const initialColors = {};
      Object.keys(colors).forEach((color) => {
        initialColors[color] = true;
      });
      setSelectedColors(initialColors);
    }

    if (savedAccent) {
      setAccent(savedAccent);
    }

    if (savedGender) {
      setGender(savedGender);
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
    Cookies.set('accent', accent, { expires: 365 });
    Cookies.set('gender', gender, { expires: 365 });

    // Show notification
    setNotification('Your preferences have been applied.');

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="Preferences">
      <h2>Choose your colors:</h2>
      {notification && <p className="notification">{notification}</p>} {/* Subtle notification */}
      <p>The same color might appear multiple times in a row. This is by design.</p>
      <div className="color-list">
        {Object.keys(colors).map((color) => (
          <label key={color} className="color-option" style={{ backgroundColor: colors[color] }}>
            <input
              type="checkbox"
              checked={selectedColors[color]}
              onChange={() => handleColorToggle(color)}
            />
            <span style={color === 'white' ? { color: 'black' } : {}}>{color}</span>
          </label>
        ))}
      </div>

      <h3>Accent:</h3>
      <div className="accent-list">
        <label>
          <input
            type="radio"
            name="accent"
            value="american"
            checked={accent === 'american'}
            onChange={() => setAccent('american')}
          />
          🇺🇸 American
        </label>
        <label>
          <input
            type="radio"
            name="accent"
            value="british"
            checked={accent === 'british'}
            onChange={() => setAccent('british')}
          />
          🇬🇧 British
        </label>
      </div>

      <h3>Gender:</h3>
      <div className="gender-list">
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === 'male'}
            onChange={() => setGender('male')}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === 'female'}
            onChange={() => setGender('female')}
          />
          Female
        </label>
      </div>

      <button className="apply-button" onClick={handleSavePreferences}>
        Apply
      </button>
    </div>
  );
}

export default Preferences;
