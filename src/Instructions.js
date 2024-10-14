import React from 'react';

const Instructions = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>INSTRUCTIONS:</h2>
      <p>
        To play blindfolded, this app requires microphone access to hear your answers.
        You'll need speakers to hear the answers. Please try a round without your
        blindfold so that you can confirm any browser permissions for your mic that
        will pop up and make sure it's working.
      </p>
      <p>
        The randomized colors are: black, white, gray, brown, red, orange, yellow,
        green, blue, purple, and pink. Say the color out aloud and clearly so that
        the app can distinguish what you are saying. If at any time you want to know
        what color it is, say "what color is it?".
      </p>
      <p>
        The same color might appear multiple times in a row. This is by design.
      </p>
      <h3>To start the game:</h3>
      <p>
        Since you are blindfolded, you can click/tap anywhere on your screen.
      </p>
      <h3>To get a new color:</h3>
      <p>
        To get a new color or skip a color, click anywhere again. You can also say
        "next". You won't get a new color until you do this. This allows you to get
        familiar with the color for as long as you like.
      </p>
      <p>
        Future updates: A randomized shape game.
      </p>
      <h3>Enjoy!</h3>
    </div>
  );
};

export default Instructions;
