import React from 'react';
import { Navigate } from 'react-router-dom';
import SpeechRecognition from 'react-speech-recognition';
import Cookies from 'js-cookie';
import voiceHandler from '../../VoiceHandler';
import './ColorGame.css';

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
      correctGuess: false,
      navigateToHome: false,
      selectedColors: {},
    };
    this.isSpeaking = false;

    // Bind all methods to ensure 'this' context is correct
    this.setupRecognition = this.setupRecognition.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
    this.handleTranscript = this.handleTranscript.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGameAndReset = this.stopGameAndReset.bind(this);
    this.initializeColorPreferences = this.initializeColorPreferences.bind(this);
    this.isCorrectColor = this.isCorrectColor.bind(this);
    this.processColor = this.processColor.bind(this);
  }

  componentDidMount() {
    this.initializeColorPreferences();

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition software. Please try Google Chrome.');
    } else {
      console.log('Initializing speech recognition...');
      this.setupRecognition();
    }
  }

  componentWillUnmount() {
    this.cleanupRecognition();
    console.log('Speech recognition instance cleaned up.');
  }

  initializeColorPreferences() {
    const savedPreferences = Cookies.get('selectedColors');
    if (savedPreferences) {
      try {
        const selectedColors = JSON.parse(savedPreferences);
        this.setState({ selectedColors });
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
        this.setAllColorsSelected();
      }
    } else {
      this.setAllColorsSelected();
    }
  }

  setAllColorsSelected() {
    const initialColors = {};
    Object.keys(colors).forEach((color) => {
      initialColors[color] = true;
    });
    this.setState({ selectedColors: initialColors }, () => {
      Cookies.set('selectedColors', JSON.stringify(initialColors), { expires: 365 });
      console.log('Initial color preferences cookie created with all colors selected.');
    });
  }

  setupRecognition() {
    if (!this.recognition) {
      this.recognition = SpeechRecognition.getRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        if (this.isSpeaking || !this.state.listening) return;

        console.log('Received voice input result...');
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            let transcript = event.results[i][0].transcript.toLowerCase().trim();
            console.log(`voice input: ${transcript}`);
            this.handleTranscript(transcript);
          }
        }
      };

      console.log('Speech recognition setup complete.');
    }
  }

  cleanupRecognition() {
    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.stop();
        this.recognition.abort();
      } catch (error) {
        console.warn('Warning: Attempt to stop recognition failed.');
      } finally {
        SpeechRecognition.stopListening();
        this.recognition = null;
      }
    }
  }

  handleTranscript(transcript) {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    // Split the transcript into individual words
    const words = transcript.split(' ');

    for (let word of words) {
      // If the word is a recognized color or synonym, process it
      if (this.isCorrectColor(word)) {
        this.processColor(word);
        return;  // Stop processing further words after finding a match
      }
    }

    // Ignore irrelevant input
    console.log("Irrelevant input, ignoring...");
  }

  isCorrectColor(word) {
    const { currentColorName } = this.state;
    const allValidColors = [...Object.keys(colors), ...voiceHandler.getSynonyms(currentColorName)];

    const lowerCaseInput = word.toLowerCase();
    return allValidColors.includes(lowerCaseInput);
  }

  processColor(colorInput) {
    const { currentColorName } = this.state;

    if (colorInput === currentColorName || voiceHandler.getSynonyms(currentColorName).includes(colorInput)) {
      voiceHandler.speak('Correct!');
      this.setState({ correctGuess: true });  // Stay on the same color after a correct guess
    } else {
      voiceHandler.speak('Try again.');
    }
  }

  startListening() {
    if (!this.isSpeaking && !this.state.listening) {
      console.log('instruction output: Start listening...');
      this.cleanupRecognition();
      this.setupRecognition();
      SpeechRecognition.startListening({ continuous: true });
      this.setState({ listening: true }, () => {
        console.log('Listening state updated: ', this.state.listening);
      });
    }
  }

  stopListening() {
    if (this.state.listening) {
      console.log('instruction output: Stop listening...');
      try {
        if (this.recognition) {
          this.recognition.stop();
          this.recognition.abort();
        }
      } catch (error) {
        console.warn('Warning: Attempt to stop recognition failed.');
      } finally {
        SpeechRecognition.stopListening();
      }
      this.setState({ listening: false }, () => {
        console.log('Listening state updated: ', this.state.listening);
      });
    }
  }

  setNewColor() {
    const { selectedColors } = this.state;
    const availableColors = Object.keys(selectedColors).filter((color) => selectedColors[color]);
    const randomColorName = availableColors[Math.floor(Math.random() * availableColors.length)];
    console.log(`New color chosen: ${randomColorName}`);
    this.setState({ currentColorName: randomColorName, correctGuess: false }, () => {
      voiceHandler.speak("What's this color?");
    });
  }

  startGame() {
    console.log('Game started');
    this.cleanupRecognition();
    this.setState({ gameStarted: true }, () => {
      this.setupRecognition();
      this.setNewColor();
      this.startListening();
    });
  }

  stopGameAndReset() {
    this.stopListening();
    setTimeout(() => {
      this.setState({ currentColorName: '', gameStarted: false, navigateToHome: true }, () => {
        console.log('Game stopped and reset.');
      });
    }, 500);
  }

  render() {
    if (this.state.navigateToHome) {
      return <Navigate to="/" />;
    }

    const { gameStarted, currentColorName } = this.state;
    const backgroundColor = currentColorName ? colors[currentColorName] : 'black';

    return (
      <div
        className="ColorGame"
        style={{ backgroundColor }}  // Dynamically set the background color
        onClick={(e) => {
          if (e.target === e.currentTarget && gameStarted) {
            console.log('instruction output: Screen clicked to get a new color');
            this.setNewColor();
          }
        }}
      >
        <div>
          <h1>Color Game</h1>
          {!gameStarted && (
            <button
              className="StartGameButton"
              onClick={(e) => {
                e.stopPropagation();
                console.log('instruction output: Start Game button clicked');
                this.startGame();
              }}
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default ColorGame;
