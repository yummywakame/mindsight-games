import React from 'react';
import SpeechRecognition from 'react-speech-recognition';
import InstructionsPage from './InstructionsPage';

const colors = {
  "black": "#000000",
  "white": "#FFFFFF",
  "gray": "#808080",
  "brown": "#8B4513",
  "red": "#DC143C",
  "yellow": "#FFD700",
  "orange": "#FF7F50",
  "blue": "#1E90FF",
  "green": "#008000",
  "purple": "#6A5ACD",
  "pink": "#FF00FF"
};

const synonyms = {
  "white": ["white", "what", "quite"],
  "green": ["green", "forest green"],
  "purple": ["purple", "violet", "lavender"],
  "pink": ["pink", "magenta"],
  "red": ["red", "crimson", "maroon"],
  "gray": ["gray", "silver"],
  "blue": ["blue", "sky"],
  "orange": ["orange", "dark yellow"]
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "black",
      listening: false,
      showInstructions: false,
      gameStarted: false,
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
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      if (this.isSpeaking || !this.state.listening) return;

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
    this.setState({ currentColor: colors[randomColor], showInstructions: false, gameStarted: true });
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
      this.setState({ currentColor: "black", showInstructions: false, gameStarted: false });
    } else {
      this.checkAnswer(transcript);
    }
  };

  render() {
    if (this.state.showInstructions) {
      return (
        <InstructionsPage
          onBeginGame={() => {
            console.log("instruction output: Begin game clicked");
            this.setNewColor();
          }}
        />
      );
    }

    return (
      <div
        className="App"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            // Only start the game if clicking on the background
            console.log("instruction output: Screen clicked to start game");
            this.setNewColor();
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.currentTarget) {
            // Only start the game if touching on the background
            console.log("instruction output: Screen touched to start game");
            this.setNewColor();
          }
        }}
        style={{
          backgroundColor: this.state.currentColor,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Raleway', sans-serif",
          color: "white",
          textAlign: "center",
        }}
      >
        {!this.state.gameStarted && (
          <div>
            <h1>Mindsight Practice</h1>
            <h2>Color Game</h2>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to the background div
                  console.log("instruction output: Instructions button clicked");
                  this.setState({ showInstructions: true });
                }}
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  fontSize: "1em",
                  cursor: "pointer",
                }}
              >
                Instructions
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to the background div
                  console.log("instruction output: Start Game button clicked");
                  this.setNewColor();
                }}
                style={{
                  padding: "10px 20px",
                  fontSize: "1em",
                  cursor: "pointer",
                }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
