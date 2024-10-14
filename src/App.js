import React from 'react';
import SpeechRecognition from 'react-speech-recognition';

const colors = ["black", "white", "brown", "red", "yellow", "dark blue", "light blue", "dark green", "light green", "orange", "purple", "gray"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "",
      listening: false,
    };
    this.isSpeaking = false;
    this.transcriptRef = "";
    this.recognition = null;
  }

  componentDidMount() {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition software. Please try Google Chrome.");
    } else {
      this.setupRecognition();
    }
  }

  setupRecognition = () => {
    // Create a new SpeechRecognition instance
    this.recognition = SpeechRecognition.getRecognition();
    this.recognition.continuous = true;

    this.recognition.onresult = (event) => {
      if (this.isSpeaking || !this.state.listening) return;

      // Get the latest result
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log(`voice input: ${transcript}`);

      this.handleTranscript(transcript);
    };
  };

  startListening = () => {
    if (!this.isSpeaking && !this.state.listening) {
      console.log("instruction output: Start listening...");
      SpeechRecognition.startListening({ continuous: true });
      this.setState({ listening: true });
    }
  };

  stopListening = () => {
    if (this.state.listening) {
      console.log("instruction output: Stop listening...");
      SpeechRecognition.stopListening();
      this.setState({ listening: false });
    }
  };

  speak = (message) => {
    if (this.isSpeaking) return;

    console.log(`instruction output: ${message}`);

    this.isSpeaking = true;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);

    this.stopListening();

    utterance.onend = () => {
      this.isSpeaking = false;
      console.log("instruction output: Finished speaking...");
      setTimeout(() => {
        this.startListening();
      }, 1000);
    };

    synth.speak(utterance);
  };

  setNewColor = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(`New color chosen: ${randomColor}`);
    this.setState({ currentColor: randomColor });
    this.speak(`What is this color?`);
  };

  revealColor = () => {
    this.speak(`The color is ${this.state.currentColor}.`);
  };

  checkAnswer = (userInput) => {
    if (userInput === this.state.currentColor) {
      this.speak(`Well done! The color is ${this.state.currentColor}.`);
    } else {
      this.speak(`Try again.`);
    }
  };

  handleTranscript = (transcript) => {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    if (transcript.includes("what is it") || transcript.includes("what color")) {
      console.log("voice input: What is it?");
      this.revealColor();
    } else if (transcript.includes("next")) {
      console.log("voice input: next");
      this.setNewColor();
    } else {
      const matchedColor = colors.find(color => {
        const colorWords = color.split(" ");
        return colorWords.every(word => transcript.includes(word));
      });

      if (matchedColor) {
        this.checkAnswer(matchedColor);
      }
    }
  };

  render() {
    return (
      <div
        className="App"
        style={{
          backgroundColor: this.state.currentColor,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            console.log("instruction output: Start Game button clicked");
            this.setNewColor();
          }}
          style={{ padding: "10px 20px", fontSize: "1.5em" }}
        >
          Start Game
        </button>
      </div>
    );
  }
}

export default App;
