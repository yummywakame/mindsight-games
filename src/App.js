import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const colors = ["black", "white", "brown", "red", "yellow", "blue", "green", "orange", "purple", "gray"];

function App() {
  const [currentColor, setCurrentColor] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition software. Please try Google Chrome.");
      return;
    }
    setNewColor();
  }, []);

  useEffect(() => {
    if (transcript.toLowerCase().includes("what color is it") || transcript.toLowerCase().includes("what is it")) {
      revealColor();
      resetTranscript();
    } else if (transcript.toLowerCase().includes("next")) {
      setNewColor();
      resetTranscript();
    }
  }, [transcript]);

  const setNewColor = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
  };

  const revealColor = () => {
    alert(`The color is ${currentColor}.`);
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: currentColor,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={startListening} style={{ padding: "10px 20px", fontSize: "1.5em" }}>
        Start Game
      </button>
    </div>
  );
}

export default App;

