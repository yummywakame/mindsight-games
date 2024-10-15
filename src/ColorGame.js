import React from 'react';
import SpeechRecognition from 'react-speech-recognition';
import Cookies from 'js-cookie';
import voiceHandler from './VoiceHandler';

// Colors definition
const colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  yellow: '#FFD700',
  green: '#008000',
  blue: '#1E90FF',
  purple: '#6A5ACD',
  pink: '#FF00FF',
  red: '#DC143C',
  orange: '#FF7F50',
};

class ColorGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColorName: '',
      listening: false,
      gameStarted: false,
    };
    this.isSpeaking = false;

    // Bind methods to this instance
    this.setupRecognition = this.setupRecognition.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
    this.handleTranscript = this.handleTranscript.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition software. Please try Google Chrome.');
    } else {
      console.log('Initializing speech recognition...');
      this.setupRecognition();
    }
  }

  setupRecognition() {
    this.recognition = SpeechRecognition.getRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    // Adding event listener for recognition results
    this.recognition.onresult = (event) => {
      if (this.isSpeaking || !this.state.listening) return;

      console.log('Received voice input result...');
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          console.log(`voice input: ${transcript}`);
          this.handleTranscript(transcript);
        }
      }
    };

    console.log('Speech recognition setup complete.');
  }

  startListening() {
    if (!this.isSpeaking && !this.state.listening) {
      console.log('instruction output: Start listening...');
      this.recognition.start(); // Explicitly start the recognition
      this.setState({ listening: true }, () => {
        console.log('Listening state updated: ', this.state.listening);
      });
    }
  }

  stopListening() {
    if (this.state.listening) {
      console.log('instruction output: Stop listening...');
      this.recognition.stop(); // Explicitly stop the recognition
      this.setState({ listening: false }, () => {
        console.log('Listening state updated: ', this.state.listening);
      });
    }
  }

  setNewColor() {
    const colorsArray = Object.keys(colors);
    const randomColorName = colorsArray[Math.floor(Math.random() * colorsArray.length)];
    console.log(`New color chosen: ${randomColorName}`);
    this.setState({ currentColorName: randomColorName }, () => {
      voiceHandler.speak("What's this color?");
    });
  }

  handleTranscript(transcript) {
    if (this.isSpeaking || !this.state.listening) return;

    const cleanedTranscript = transcript.toLowerCase().trim();
    const currentColorName = this.state.currentColorName.toLowerCase().trim();

    console.log(`voice input processed: ${cleanedTranscript}`);

    if (cleanedTranscript === 'what is it' || cleanedTranscript === 'what color') {
      console.log('voice input: What is it?');
      voiceHandler.speak('The color is ' + this.state.currentColorName);
    } else if (cleanedTranscript === 'next') {
      console.log('voice input: next');
      this.setNewColor();
    } else if (cleanedTranscript === 'stop' || cleanedTranscript === 'restart' || cleanedTranscript === 'reset') {
      console.log('voice input: Stop or restart the game');
      this.stopListening();
      this.setState({ currentColorName: '', gameStarted: false });
    } else {
      console.log(`Checking answer: transcript: "${cleanedTranscript}" vs color: "${currentColorName}"`);
      if (cleanedTranscript === currentColorName) {
        voiceHandler.speak(`Well done! The color is ${this.state.currentColorName}.`);
      } else {
        voiceHandler.speak('Try again.');
      }
    }
  }

  startGame() {
    console.log('Game started');
    this.setState({ gameStarted: true }, () => {
      this.setNewColor();
      this.startListening();
    });
  }

  render() {
    const { gameStarted, currentColorName } = this.state;

    return (
      <div
        className="ColorGame"
        onClick={(e) => {
          if (e.target === e.currentTarget && gameStarted) {
            console.log('instruction output: Screen clicked to get a new color');
            this.setNewColor();
          }
        }}
        style={{
          backgroundColor: currentColorName ? colors[currentColorName] : 'black',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Raleway', sans-serif",
          color: 'white',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <div>
          <h1>Color Game</h1>
          {!gameStarted && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent button click from triggering background click
                console.log('instruction output: Start Game button clicked');
                this.startGame();
              }}
              style={{
                padding: '10px 20px',
                marginTop: '20px',
                fontSize: '1.2em',
                cursor: 'pointer',
              }}
            >
              Start Game
            </button>
          )}
          <button
            onClick={() => {
              this.props.history.push('/');
            }}
            style={{
              padding: '10px 20px',
              marginLeft: '20px',
              fontSize: '1.2em',
              cursor: 'pointer',
              marginTop: !gameStarted ? '20px' : '0',
            }}
          >
            Home
          </button>
        </div>
      </div>
    );
  }
}

export default ColorGame;
