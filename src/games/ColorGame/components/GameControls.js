// GameControls.js
// This component renders the buttons to start or stop the game. It takes three props:
// - startGame: A function to start the game.
// - stopGame: A function to stop and reset the game.
// - gameStarted: A boolean that indicates whether the game has started.

import React from 'react';

const GameControls = ({ gameStarted, startGame, stopGame }) => {
  return (
    <div className="game-controls">
      {!gameStarted ? (
        <button className="start-button" onClick={startGame}>Start Game</button>
      ) : (
        <button className="stop-button" onClick={stopGame}>Stop Game</button>
      )}
    </div>
  );
};

export default GameControls;