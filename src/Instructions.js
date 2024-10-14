import React from 'react';

const Instructions = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>INSTRUCTIONS:</h2>
      <p>
        To play blindfolded, this app requires microphone access to hear your answers and you will need speakers to hear the answers. 
        Please try a round without your blindfold on so that you can confirm any browser permissions for your mic that
        will pop up. Ensure everything is working before you put your blindfold on.
      </p>

      <h3>To start the game:</h3>
      <p>
        Since you are blindfolded, you can click/tap anywhere on the color game screen.
      </p>
      <h3>To get a new color / skip a color:</h3>
      <p>
        Click anywhere on the color game screen. Or you can say
        "next". You won't get a new color until you do either. This allows you to get
        familiar with the color for as long as you like.
      </p>
      <p>
        <i><b>Future updates:</b> A randomized shape game.</i>
      </p>
      <h3>Enjoy!</h3>
    </div>
  );
};

export default Instructions;
