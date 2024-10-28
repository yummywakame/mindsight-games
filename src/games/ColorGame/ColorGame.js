import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import GameDisplay from './components/GameDisplay';
import voiceHandler from '../../VoiceHandler';
import { colors } from '../../Preferences';
import './ColorGame.css';

class ColorGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColorName: '',
      currentColorHex: '',
      listening: false,
      gameStarted: false,
      correctGuess: false,
      navigateToHome: false,
      selectedColors: {},
    };
  }

  componentDidMount = () => {
    this.initializeColorPreferences();
    if (voiceHandler.browserSupportsSpeechRecognition()) {
      this.setupRecognition();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };

  initializeColorPreferences = () => {
    const savedColors = Cookies.get('selectedColors');
    if (savedColors) {
      const parsedColors = JSON.parse(savedColors);
      this.setState({ selectedColors: parsedColors });
      console.log('Loaded selected colors from cookies:', parsedColors);
    } else {
      console.log('No selected colors found in cookies.');
    }
  };

  setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log('Received voice input:', transcript);
      this.handleTranscript(transcript);
    };

    this.recognition.onend = () => {
      if (this.state.listening) {
        this.startListening();
        console.log('Restarting speech recognition...');
      }
    };

    console.log('Speech recognition set up.');
  };

  startListening = () => {
    this.recognition.start();
    this.setState({ listening: true });
    console.log('Started listening for voice input...');
  };

  stopListening = () => {
    this.recognition.stop();
    this.setState({ listening: false });
    console.log('Stopped listening for voice input.');
  };

  setNewColor = () => {
    const colorNames = Object.keys(this.state.selectedColors).filter(
      (color) => this.state.selectedColors[color]
    );
    const randomColor = colorNames[Math.floor(Math.random() * colorNames.length)];
    const hexValue = colors[randomColor];
    this.setState({
      currentColorName: randomColor,
      currentColorHex: hexValue,
      correctGuess: false,
    });
    console.log(`New color set: ${randomColor} (${hexValue})`);
    voiceHandler.speak(`What's this color?`);
  };

  handleTranscript = (transcript) => {
    console.log('Processing transcript:', transcript);
    const { currentColorName } = this.state;

    if (this.isCorrectColor(transcript)) {
      voiceHandler.speak(`Yes, it is ${currentColorName}`);
      this.setState({ correctGuess: true });
      console.log('Correct guess:', currentColorName);
    } else if (transcript === 'next') {
      this.setNewColor();
    } else if (transcript.includes('what')) {
      voiceHandler.speak(`It is ${currentColorName}`);
      console.log('Revealed the color:', currentColorName);
    } else {
      voiceHandler.speak('Try again.');
      console.log('Incorrect guess. Prompting to try again.');
    }
  };

  isCorrectColor = (transcript) => {
    const { currentColorName } = this.state;
    const synonyms = voiceHandler.getSynonyms(currentColorName);
    const isCorrect = transcript.includes(currentColorName) || synonyms.includes(transcript);
    console.log(`Checking if '${transcript}' matches '${currentColorName}' or synonyms:`, synonyms);
    return isCorrect;
  };

  startGame = () => {
    this.setState({ gameStarted: true, correctGuess: false });
    console.log('Game started.');
    this.setNewColor();
    this.startListening();
  };

  stopGameAndReset = () => {
    this.stopListening();
    this.setState({
      gameStarted: false,
      correctGuess: false,
      currentColorName: '',
      currentColorHex: '',
    });
    console.log('Game stopped and reset.');
  };

  render() {
    const { gameStarted, currentColorHex, navigateToHome } = this.state;

    if (navigateToHome) {
      return <Navigate to="/" />;
    }

    return (
      <GameDisplay
        currentColorHex={currentColorHex}
        gameStarted={gameStarted}
        startGame={this.startGame}
        stopGame={this.stopGameAndReset}
        setNewColor={this.setNewColor}
      />
    );
  }
}

export default ColorGame;
