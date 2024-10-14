import React, { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const colors = ["black", "white", "brown", "red", "yellow", "blue", "green", "orange", "purple", "gray"];

function App() {
  const [currentColor, setCurrentColor] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const isSpeakingRef = useRef(false); // Ref to track if the app is currently speaking

  // Function to provide spoken feedback using the Web Speech API
  const speak = useCallback((message) => {
    if (isSpeakingRef.current) return; // Prevent starting a new utterance while already speaking

    console.log(`instruction output: ${message}`); // Log what the game prompts the user
    alert(`Speaking: ${message}`); // Debug alert to confirm speaking event

    isSpeakingRef.current = true; // Set speaking state to true
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    // Stop listening before speaking
    SpeechRecognition.stopListening();
    utterance.onend = () => {
      // Resume listening after speaking is done
      isSpeakingRef.current = false;
      console.log("instruction output: Resume listening after speaking");
      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true });
      }, 500); // Add a slight delay before resuming listening
    };

    synth.speak(utterance);
  }, []);

  // Function to set a new random color
  const setNewColor = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
    speak(`What is this color?`);
  }, [speak]);

  // Function to reveal the current color
  const revealColor = useCallback(() => {
    speak(`The color is ${currentColor}.`);
  }, [currentColor, speak]);

  // Function to check if the user's answer is correct
  const checkAnswer = useCallback((userInput) => {
    if (userInput === currentColor) {
      speak(`Well done! The color is ${currentColor}.`);
    } else {
      speak(`Try again.`);
    }
  }, [currentColor, speak]);

  // Effect to run once initially to set up the first color
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition software. Please try Google Chrome.");
      return;
    }
    setNewColor();
  }, [setNewColor]);

  // Effect to handle user input from the speech recognition transcript
  useEffect(() => {
    if (isSpeakingRef.current) return; // Prevent processing transcript while speaking

    const userInput = transcript.toLowerCase().trim();
    console.log(`voice input: ${userInput}`); // Log the user's speech input

    if (userInput.includes("what is it") || userInput.includes("what color")) {
      console.log("voice input: What is it?"); // Log specific command "What is it?"
      revealColor();
      resetTranscript(); // Reset after processing
    } else if (userInput.includes("next")) {
      console.log("voice input: next"); // Log specific command "next"
      setNewColor();
      resetTranscript(); // Reset after processing
    } else {
      const matchedColor = colors.find(color => userInput.includes(color));
      if (matchedColor) {
        checkAnswer(matchedColor);
        resetTranscript(); // Reset after processing
      }
    }
  }, [transcript, revealColor, checkAnswer, setNewColor, resetTranscript]);

  // Function to start listening to user input
  const startListening = () => {
    console.log("instruction output: Start listening..."); // Log when listening starts
    alert("Listening for your commands..."); // Debug alert to confirm listening
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
      <button onClick={() => { 
        console.log("instruction output: Start Game button clicked"); // Log when "Start Game" button is clicked
        startListening();
      }} style={{ padding: "10px 20px", fontSize: "1.5em" }}>
        Start Game
      </button>
    </div>
  );
}

export default App;
