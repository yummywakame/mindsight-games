import React from 'react';
import Cookies from 'js-cookie';
import GameControls from './components/GameControls';
import voiceHandler from '../../VoiceHandler';
import './ColorGame.css';

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
      console.error('Speech recognition is not supported in this browser');
    }
  };

  initializeColorPreferences = () => {
    const savedColors = Cookies.get('selectedColors'); // This line is already using Cookies.get, not getJSON
    if (savedColors) {
      const parsedColors = JSON.parse(savedColors); // Manually parse the stringified JSON
      this.setState({ selectedColors: parsedColors });
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
      this.handleTranscript(transcript);
    };

    this.recognition.onend = () => {
      if (this.state.listening) {
        this.startListening(); // Automatically restart listening if the game is ongoing
      }
    };
  };

  startListening = () => {
    this.recognition.start();
    this.setState({ listening: true });
  };

  stopListening = () => {
    this.recognition.stop();
    this.setState({ listening: false });
  };

  setNewColor = () => {
    const colors = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.setState({ currentColorName: randomColor, correctGuess: false });
    voiceHandler.speak(`What's this color?`);
  };

  handleTranscript = (transcript) => {
    const { currentColorName } = this.state;

    if (this.isCorrectColor(transcript)) {
      voiceHandler.speak(`Yes, it is ${currentColorName}`);
      this.setState({ correctGuess: true });
    } else if (transcript === 'next') {
      this.setNewColor();
    } else if (transcript === 'what is it') {
      voiceHandler.speak(`It is ${currentColorName}`);
    } else {
      voiceHandler.speak('Try again.');
    }
  };

  isCorrectColor = (transcript) => {
    const { currentColorName } = this.state;
    const synonyms = voiceHandler.getSynonyms(currentColorName);
    return transcript === currentColorName || synonyms.includes(transcript);
  };

  startGame = () => {
    this.setState({ gameStarted: true, correctGuess: false });
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
  };

  cleanupRecognition = () => {
    this.recognition = null;
    this.setState({ listening: false });
  };

  render() {
    const { gameStarted } = this.state;

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
