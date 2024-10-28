import React from 'react';
import GameControls from './GameControls';

// GameDisplay renders the background color based on the current color hex.
// Also renders GameControls within it, to keep the controls in the same area as the display.

const GameDisplay = ({ currentColorHex, gameStarted, startGame, stopGame, setNewColor }) => {
  const backgroundColor = currentColorHex || 'black';

  return (
    <div
      className="ColorGame"
      style={{ backgroundColor }}
      onClick={(e) => {
        if (gameStarted && e.target === e.currentTarget) {
          setNewColor();
        }
      }}
    >
      <h1>Color Game</h1>
      <GameControls gameStarted={gameStarted} startGame={startGame} stopGame={stopGame} />
    </div>
  );
};

export default GameDisplay;