import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import GameControls from './components/GameControls';
import voiceHandler from '../../VoiceHandler';
import './ColorGame.css'; // Ensure all relevant styling is handled here

class ColorGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColorName: '',
      listening: false,
      gameStarted: false,
      correctGuess: false,
      navigateToHome: false,
      selectedColors: {},
    };

    this.isSpeaking = false;
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
        this.startListening(); // Automatically restart listening if the game is ongoing
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
    const colors = Object.keys(this.state.selectedColors).filter(
      (color) => this.state.selectedColors[color]
    );
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.setState({ currentColorName: randomColor, correctGuess: false });
    console.log('New color set:', randomColor);
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
    } else if (transcript === 'what is it') {
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
    });
    console.log('Game stopped and reset.');
  };

  cleanupRecognition = () => {
    this.recognition = null;
    this.setState({ listening: false });
    console.log('Speech recognition cleaned up.');
  };

  render() {
    const { gameStarted } = this.state;

    if (this.state.navigateToHome) {
      return <Navigate to="/" />;
    }

    return (
      <div className="color-game-container">
        <h1 className="color-game-title">Color Game</h1>
        {gameStarted ? (
          <div>
            <GameControls stopGame={this.stopGameAndReset} />
          </div>
        ) : (
          <div>
            <button onClick={this.startGame} className="start-game-button">
              Start Game
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ColorGame;
