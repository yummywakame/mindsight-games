import React from 'react';
import SpeechRecognition from 'react-speech-recognition';
import VoiceHandler from './VoiceHandler';

class ColorGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: 'black',
      gameStarted: false,
      listening: false,
    };

    this.isSpeaking = false;
    this.recognition = null;

    // Bind functions
    this.setupRecognition = this.setupRecognition.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.speak = this.speak.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleTranscript = this.handleTranscript.bind(this);
  }

  componentDidMount() {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition software. Please try Google Chrome.");
    } else {
      this.setupRecognition();
    }
  }

  setupRecognition() {
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
  }

  startListening() {
    if (!this.isSpeaking && !this.state.listening) {
      console.log("instruction output: Start listening...");
      SpeechRecognition.startListening({ continuous: true });
      this.setState({ listening: true });
    }
  }

  stopListening() {
    if (this.state.listening) {
      console.log("instruction output: Stop listening...");
      SpeechRecognition.stopListening();
      this.setState({ listening: false });
    }
  }

  speak(message) {
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
  }

  setNewColor() {
    const colors = [
      '#000000', // black
      '#FFFFFF', // white
      '#808080', // gray
      '#8B4513', // brown
      '#DC143C', // red
      '#FFD700', // yellow
      '#FF7F50', // orange
      '#1E90FF', // blue
      '#008000', // green
      '#6A5ACD', // purple
      '#FF00FF', // pink
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(`New color chosen: ${randomColor}`);
    this.setState({ currentColor: randomColor });
    this.speak("What's this color?");
  }

  startGame() {
    console.log('Game started');
    this.setNewColor();
    this.setState({ gameStarted: true });
    this.startListening();
  }

  handleTranscript(transcript) {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    if (transcript === 'next') {
      console.log('voice input: next');
      this.setNewColor();
    } else if (transcript === 'stop' || transcript === 'restart' || transcript === 'reset') {
      console.log('voice input: Stop or restart the game');
      this.stopListening();
      this.setState({ currentColor: 'black', gameStarted: false });
    } else {
      VoiceHandler.checkAnswer(transcript, this.state.currentColor, colors);
    }
  }

  render() {
    return (
      <div
        className="ColorGame"
        onClick={(e) => {
          if (this.state.gameStarted && e.target === e.currentTarget) {
            console.log('instruction output: Screen clicked to get a new color');
            this.setNewColor();
          }
        }}
        style={{
          backgroundColor: this.state.currentColor,
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Raleway', sans-serif",
          color: 'white',
          textAlign: 'center',
          margin: '0',
          overflow: 'hidden',
        }}
      >
        {!this.state.gameStarted ? (
          <div>
            <h1>Color Game</h1>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the background from being clicked
                this.startGame();
              }}
              style={{
                padding: '10px 20px',
                fontSize: '1em',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              Start Game
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the background from being clicked
                this.props.history.push('/');
              }}
              style={{
                padding: '10px 20px',
                fontSize: '1em',
                cursor: 'pointer',
                marginLeft: '20px',
                marginTop: '20px',
              }}
            >
              Home
            </button>
          </div>
        ) : (
          <div>
            <h1>Color Game</h1>
            <p>Click anywhere to get a new color.</p>
          </div>
        )}
      </div>
    );
  }
}

export default ColorGame;
