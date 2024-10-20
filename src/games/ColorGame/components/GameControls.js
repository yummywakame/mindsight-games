// GameControls.js
// This component renders the buttons to start or stop the game. It takes three props:
// - startGame: A function to start the game.
// - stopGameAndReset: A function to stop and reset the game.
// - gameStarted: A boolean that indicates whether the game has started.

import React from 'react';

const GameControls = ({ gameStarted, startGame, stopGame }) => {
  return (
    <div style={styles.container}>
      {!gameStarted ? (
        <button style={styles.button} onClick={startGame}>
          Start Game
        </button>
      ) : (
        <button style={styles.button} onClick={stopGame}>
          Stop Game
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Centers the button vertically
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default GameControls;
