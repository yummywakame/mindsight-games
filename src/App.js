import React, { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const colors = ["black", "white", "brown", "red", "yellow", "blue", "green", "orange", "purple", "gray"];

function App() {
  const [currentColor, setCurrentColor] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const isSpeakingRef = useRef(false); // Ref to track if the app is currently speaking

  const speak = useCallback((message) => {
    if (isSpeakingRef.current) return; // Prevent starting a new utterance while already speaking

    isSpeakingRef.current = true; // Set speaking state to true
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    // Pause listening before speaking
    SpeechRecognition.stopListening();
    utterance.onend = () => {
      // Resume listening after speaking is done
      isSpeakingRef.current = false;
      SpeechRecognition.startListening({ continuous: true });
    };

    synth.speak(utterance);
  }, []);

  const setNewColor = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
    speak(`What is this color?`);
  }, [speak]);

  const revealColor = useCallback(() => {
    speak(`The color is ${currentColor}.`);
  }, [currentColor, speak]);

  const checkAnswer = useCallback((userInput) => {
    if (userInput === currentColor) {
      speak(`Well done! The color is ${currentColor}.`);
    } else {
      speak(`Try again.`);
    }
  }, [currentColor, speak]);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition software. Please try Google Chrome.");
      return;
    }
    setNewColor();
  }, [setNewColor]);

  useEffect(() => {
    console.log("Transcript:", transcript); // Debugging: Log transcript to see if it captures speech correctly
    if (isSpeakingRef.current) return; // Prevent processing transcript while speaking

    const userInput = transcript.toLowerCase().trim();
    const words = userInput.split(" ");

    if (words.includes("what") && words.includes("color")) {
      revealColor();
      resetTranscript();
    } else if (words.includes("next")) {
      setNewColor();
      resetTranscript();
    } else {
      const matchedColor = colors.find(color => words.includes(color));
      if (matchedColor) {
        checkAnswer(matchedColor);
        resetTranscript();
      }
    }
  }, [transcript, revealColor, checkAnswer, setNewColor, resetTranscript]);

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
