import React, { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const colors = ["black", "white", "brown", "red", "yellow", "blue", "green", "orange", "purple", "gray"];

function App() {
  const [currentColor, setCurrentColor] = useState("");
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const isSpeakingRef = useRef(false); // Ref to track if the app is currently speaking

  // Function to start listening to user input
  const startListening = useCallback(() => {
    if (!isSpeakingRef.current && !listening) {
      console.log("instruction output: Start listening..."); // Log when listening starts
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening]);

  // Function to provide spoken feedback using the Web Speech API
  const speak = useCallback((message) => {
    if (isSpeakingRef.current) return; // Prevent starting a new utterance while already speaking

    console.log(`instruction output: ${message}`); // Log what the game prompts the user
    alert(`Speaking: ${message}`); // Debug alert to confirm speaking event

    isSpeakingRef.current = true; // Set speaking state to true
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    // Stop listening before speaking
    if (listening) {
      SpeechRecognition.stopListening();
      console.log("instruction output: Microphone stopped for speaking...");
    }

    utterance.onend = () => {
      // Mark speaking as done
      isSpeakingRef.current = false;
      console.log("instruction output: Finished speaking...");
      resetTranscript(); // Reset transcript to ensure no residual inputs
      startListening(); // Explicitly resume listening after speaking
    };

    synth.speak(utterance);
  }, [listening, resetTranscript, startListening]);

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

  // Effect to handle user input from the speech recognition transcript
  useEffect(() => {
    if (isSpeakingRef.current || !listening) return; // Prevent processing transcript while speaking or if not listening

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
  }, [transcript, revealColor, checkAnswer, setNewColor, resetTranscript, listening]);

  // Debugging for speech recognition events
  useEffect(() => {
    if (listening) {
      console.log("instruction output: Microphone is now listening...");
    } else {
      console.log("instruction output: Microphone is not listening...");
    }
  }, [listening]);

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
        setNewColor(); // Set initial color and prompt
      }} style={{ padding: "10px 20px", fontSize: "1.5em" }}>
        Start Game
      </button>
    </div>
  );
}

export default App;
