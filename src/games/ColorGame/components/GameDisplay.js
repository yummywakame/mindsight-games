// GameDisplay.js
// This component handles displaying the current color and updating the background.
// It takes three props:
// - currentColorName: The current color name being displayed.
// - gameStarted: A boolean that indicates if the game is running.
// - setNewColor: A function that sets a new random color when the game is in progress.

import React from 'react';

const GameDisplay = ({ currentColorName, gameStarted, setNewColor }) => {
  const backgroundColor = currentColorName ? currentColorName : 'black';

  return (
    <div
      className="ColorGame"
      style={{ backgroundColor }} // Dynamically set the background color
      onClick={(e) => {
        if (e.target === e.currentTarget && gameStarted) {
          setNewColor();
        }
      }}
    >
      <h1>Color Game</h1>
    </div>
  );
};

export default GameDisplay;
