import React, { useState, useEffect } from 'react';
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

const InstructionsPage = ({ onBeginGame, onBack, onSavePreferences }) => {
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    const savedColors = Cookies.get('selectedColors');
    if (savedColors) {
      try {
        // Convert the saved preferences to an array, if necessary
        const parsedColors = JSON.parse(savedColors);
        setSelectedColors(Array.isArray(parsedColors) ? parsedColors : Object.keys(parsedColors));
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
        setSelectedColors(Object.keys(colors)); // Fall back to selecting all colors
      }
    } else {
      setSelectedColors(Object.keys(colors)); // Default to selecting all colors
    }
  }, []);

  const handleCheckboxChange = (color) => {
    setSelectedColors((prevSelectedColors) => {
      if (prevSelectedColors.includes(color)) {
        return prevSelectedColors.filter((c) => c !== color);
      } else {
        return [...prevSelectedColors, color];
      }
    });
  };

  const handleSavePreferences = () => {
    Cookies.set('selectedColors', JSON.stringify(selectedColors), { expires: 365 });
    if (onSavePreferences) {
      onSavePreferences(selectedColors);
    }
    alert('Color preferences saved!');
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Raleway', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Instructions Section */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h2>INSTRUCTIONS:</h2>
          <p>
            To play blindfolded, this app requires microphone access to hear your answers and you will need speakers to hear the answers. Please try a round without your blindfold on so that you can confirm any browser permissions for your mic and get familiar with the game. Ensure everything is working and you know what to expect before you put your blindfold on.
          </p>
          <h3>To start the game:</h3>
          <p>
            Since you are blindfolded, you can click/tap anywhere on the color game screen or select "Start game".
          </p>
          <h3>To get a new color / skip a color:</h3>
          <p>
            Click anywhere on the color game screen. Or you can say "next". You won't get a new color until you do either. This allows you to get familiar with the color for as long as you like.
          </p>
          <h3>Future updates:</h3>
          <p>A randomized shape game.</p>
          <h3>Enjoy!</h3>
        </div>

        {/* Color Selection Section */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h3>Choose your colors:</h3>
          <p>The same color might appear multiple times in a row. This is by design.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {Object.keys(colors).map((color) => (
              <div key={color} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: colors[color],
                    borderRadius: "3px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)} // Ensure selectedColors is an array
                    onChange={() => handleCheckboxChange(color)}
                    style={{
                      position: "absolute",
                      transform: "scale(1.5)",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "20px",
          alignSelf: "center"
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            cursor: "pointer",
          }}
        >
          &lt; Back
        </button>
        <button
          onClick={onBeginGame}
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            cursor: "pointer",
          }}
        >
          Begin Game
        </button>
        <button
          onClick={handleSavePreferences}
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            cursor: "pointer",
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default InstructionsPage;
