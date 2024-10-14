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
    console.log("Transcript:", transcript); // Debugging: Log transcript to see if it captures speech correctly
    const userInput = transcript.toLowerCase();
    if (userInput.includes("what color is it") || userInput.includes("what is it")) {
      revealColor();
      resetTranscript();
    } else if (userInput.includes("next")) {
      setNewColor();
      resetTranscript();
    } else if (colors.includes(userInput)) {
      checkAnswer(userInput);
      resetTranscript();
    }
  }, [transcript]);

  const setNewColor = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
    speak(`What is this color?`);
  };

  const revealColor = () => {
    speak(`The color is ${currentColor}.`);
  };

  const checkAnswer = (userInput) => {
    if (userInput === currentColor) {
      speak(`Well done! The color is ${currentColor}.`);
    } else {
      speak(`Try again.`);
    }
  };

  const speak = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

  const startListening = () => {
    console.log("Listening..."); // Debugging: Log when listening starts
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

