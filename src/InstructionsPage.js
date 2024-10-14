import React from 'react';
import Instructions from './Instructions';

const InstructionsPage = ({ onBeginGame }) => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <Instructions />
      <button
        onClick={onBeginGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "1.2em",
          cursor: "pointer",
          alignSelf: "center",
        }}
      >
        Begin Game
      </button>
    </div>
  );
};

export default InstructionsPage;
