// utils.js
import Cookies from 'js-cookie';

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

export function loadColorPreferences() {
  let savedPreferences = Cookies.get('selectedColors');
  if (savedPreferences) {
    try {
      return JSON.parse(savedPreferences);
    } catch (error) {
      console.error('Error parsing saved preferences, initializing with defaults:', error);
    }
  }
  // If no valid saved preferences, initialize all colors as selected
  const initialColors = {};
  Object.keys(colors).forEach((color) => {
    initialColors[color] = true;
  });
  // Save default preferences to cookies
  saveColorPreferences(initialColors);
  return initialColors;
}

export function saveColorPreferences(preferences) {
  try {
    Cookies.set('selectedColors', JSON.stringify(preferences), { expires: 365 });
    console.log('Preferences saved:', preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}
