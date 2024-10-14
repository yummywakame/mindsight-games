import React from 'react';
import SpeechRecognition from 'react-speech-recognition';

const colors = {
  "black": "#000000",
  "white": "#FFFFFF",
  "gray": "#A9A9A9",
  "brown": "#8B4513",
  "red": "#DC143C",
  "yellow": "#FFD700",
  "orange": "#FF7F50",
  "light blue": "#87CEFA",
  "dark blue": "#0000FF",
  "light green": "#5FFB17",
  "dark green": "#008000",
  "purple": "#6A5ACD",
  "pink": "#FF00FF"
};

const synonyms = {
  "white": ["white", "what", "quite"],
  "light green": ["light green", "green", "lime", "emerald"],
  "dark green": ["dark green", "green", "forest"],
  "purple": ["purple", "violet", "lavender"],
  "pink": ["pink", "magenta"],
  "red": ["red", "crimson", "maroon"],
  "gray": ["gray", "silver"],
  "dark blue": ["dark blue", "blue", "navy"],
  "light blue": ["light blue", "blue", "cyan", "sky"],
  "orange": ["orange", "dark yellow"]
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "",
      listening: false,
    };
    this.isSpeaking = false;
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
    this.recognition.interimResults = true; // Capture ongoing input

    this.recognition.onresult = (event) => {
      if (this.isSpeaking || !this.state.listening) return;

      // Get the latest complete result (only final results are processed)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          console.log(`voice input: ${transcript}`);
          this.handleTranscript(transcript);
        }
      }
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
    const randomColor = Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)];
    console.log(`New color chosen: ${randomColor}`);
    this.setState({ currentColor: colors[randomColor] });
    this.speak(`What is this color?`);
  };

  revealColor = () => {
    const colorName = Object.keys(colors).find(key => colors[key] === this.state.currentColor);
    this.speak(`The color is ${colorName}.`);
  };

  checkAnswer = (userInput) => {
    const matchedColor = Object.keys(colors).find(color => {
      return userInput.includes(color) || (synonyms[color] && synonyms[color].some(synonym => userInput.includes(synonym)));
    });

    if (matchedColor && this.state.currentColor === colors[matchedColor]) {
      this.speak(`Well done! The color is ${matchedColor}.`);
    } else {
      this.speak(`Try again.`);
    }
  };

  handleTranscript = (transcript) => {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    if (transcript === "what is it" || transcript === "what color") {
      console.log("voice input: What is it?");
      this.revealColor();
    } else if (transcript === "next") {
      console.log("voice input: next");
      this.setNewColor();
    } else if (transcript === "stop" || transcript === "restart" || transcript === "reset") {
      console.log("voice input: Stop or restart the game");
      this.stopListening();
      this.setState({ currentColor: "" });
    } else {
      this.checkAnswer(transcript);
    }
  };

  render() {
    return (
      <div
        className="App"
        onClick={() => {
          console.log("instruction output: Screen clicked to start game");
          this.setNewColor();
        }}
        onTouchStart={() => {
          console.log("instruction output: Screen touched to start game");
          this.setNewColor();
        }}
        style={{
          backgroundColor: this.state.currentColor,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      </div>
    );
  }
}

export default App;
