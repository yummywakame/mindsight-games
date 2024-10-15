import React from 'react';
import SpeechRecognition from 'react-speech-recognition';
import Cookies from 'js-cookie';
import voiceHandler from './VoiceHandler';

// Colors definition moved here
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
      currentColor: 'black',
      listening: false,
    };
    this.isSpeaking = false;
    this.recognition = null;

    // Bind methods to this instance
    this.setupRecognition = this.setupRecognition.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
    this.handleTranscript = this.handleTranscript.bind(this);
  }

  componentDidMount() {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition software. Please try Google Chrome.');
    } else {
      this.setupRecognition();
      this.setNewColor(); // Start the game when the component loads
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
      console.log('instruction output: Start listening...');
      SpeechRecognition.startListening({ continuous: true });
      this.setState({ listening: true });
    }
  }

  stopListening() {
    if (this.state.listening) {
      console.log('instruction output: Stop listening...');
      SpeechRecognition.stopListening();
      this.setState({ listening: false });
    }
  }

  setNewColor() {
    const colorsArray = Object.keys(colors);
    const randomColor = colorsArray[Math.floor(Math.random() * colorsArray.length)];
    console.log(`New color chosen: ${colors[randomColor]}`);
    this.setState({ currentColor: colors[randomColor] });
    voiceHandler.speak("What's this color?");
  }

  handleTranscript(transcript) {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    if (transcript === 'what is it' || transcript === 'what color') {
      console.log('voice input: What is it?');
      voiceHandler.speak('The color is ' + this.getColorName());
    } else if (transcript === 'next') {
      console.log('voice input: next');
      this.setNewColor();
    } else if (transcript === 'stop' || transcript === 'restart' || transcript === 'reset') {
      console.log('voice input: Stop or restart the game');
      this.stopListening();
      this.setState({ currentColor: 'black' });
    } else {
      voiceHandler.checkAnswer(transcript, this.state.currentColor, colors);
    }
  }

  getColorName() {
    return Object.keys(colors).find((key) => colors[key] === this.state.currentColor);
  }

  render() {
    return (
      <div
        className="ColorGame"
        onClick={() => {
          console.log('instruction output: Screen clicked to get a new color');
          this.setNewColor();
        }}
        style={{
          backgroundColor: this.state.currentColor,
          height: '100vh',
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
          <p>Click anywhere to get a new color.</p>
        </div>
      </div>
    );
  }
}

export default ColorGame;
