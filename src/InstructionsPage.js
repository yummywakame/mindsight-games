import React from 'react';
import './css/InstructionsPage.css'; // Import the CSS file

const InstructionsPage = () => {
  return (
    <div className="InstructionsPage">
      {/* Instructions Section */}
      <div className="instructions-content">
        <h2>INSTRUCTIONS:</h2>
        <p>
          To play blindfolded, this app requires microphone access to hear your answers, and you will need speakers to hear the answers. Please try a round without your blindfold on so that you can confirm any browser permissions for your mic and get familiar with the game. Ensure everything is working and you know what to expect before you put your blindfold on.
        </p>
        <h3>To start the game:</h3>
        <p>
          Since you are blindfolded, you can click/tap anywhere on the color game screen or select "Start game."
        </p>
        <h3>To get a new color / skip a color:</h3>
        <p>
          Click anywhere on the color game screen. Or you can say "next." You won't get a new color until you do either. This allows you to get familiar with the color for as long as you like.
        </p>
        <h3>Future updates:</h3>
        <p>A randomized shape game.</p>
        <h3>Enjoy!</h3>
      </div>
    </div>
  );
};

export default InstructionsPage;
