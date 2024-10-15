import React from 'react';
import { Navigate } from 'react-router-dom';
import SpeechRecognition from 'react-speech-recognition';
import Cookies from 'js-cookie';
import voiceHandler from './VoiceHandler';
import './css/ColorGame.css';

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
      navigateToHome: false,
      selectedColors: {},
    };
    this.isSpeaking = false;

    // Bind methods to this instance
    this.setupRecognition = this.setupRecognition.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
    this.handleTranscript = this.handleTranscript.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGameAndReset = this.stopGameAndReset.bind(this);
    this.initializeColorPreferences = this.initializeColorPreferences.bind(this);
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
    // Load saved preferences from cookies if available
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
      // No cookie found or cookie is missing
      this.setAllColorsSelected();
    }
  }

  setAllColorsSelected() {
    const initialColors = {};
    Object.keys(colors).forEach((color) => {
      initialColors[color] = true;
    });
    this.setState({ selectedColors: initialColors }, () => {
      // Save the initial preferences as a cookie immediately after setting
      Cookies.set('selectedColors', JSON.stringify(initialColors), { expires: 365 });
      console.log('Initial color preferences cookie created with all colors selected.');
    });
  }

  setupRecognition() {
    if (!this.recognition) {
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
  }

  cleanupRecognition() {
    if (this.recognition) {
      try {
        this.recognition.onresult = null; // Remove event listener
        this.recognition.stop(); // Stop listening
        this.recognition.abort(); // Abort to ensure the mic is stopped completely
      } catch (error) {
        console.warn('Warning: Attempt to stop recognition failed.');
      } finally {
        SpeechRecognition.stopListening(); // Additional cleanup to ensure the mic stops
        this.recognition = null; // Clean up recognition instance
      }
    }
  }

  startListening() {
    if (!this.isSpeaking && !this.state.listening) {
      console.log('instruction output: Start listening...');
      this.cleanupRecognition(); // Clean up any previous recognition
      this.setupRecognition(); // Set up recognition again
      SpeechRecognition.startListening({ continuous: true }); // Start listening using SpeechRecognition API
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
        SpeechRecognition.stopListening(); // Additional stop to ensure everything stops
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
    this.setState({ currentColorName: randomColorName }, () => {
      voiceHandler.speak("What's this color?");
    });
  }

  handleTranscript(transcript) {
    if (this.isSpeaking || !this.state.listening) return;

    console.log(`voice input processed: ${transcript}`);

    if (transcript === 'what is it' || transcript === 'what color') {
      console.log('voice input: What is it?');
      voiceHandler.speak('The color is ' + this.state.currentColorName);
    } else if (transcript === 'next') {
      console.log('voice input: next');
      this.setNewColor();
    } else if (transcript === 'stop' || transcript === 'restart' || transcript === 'reset') {
      console.log('voice input: Stop or restart the game');
      this.stopGameAndReset();
    } else {
      // Check if the answer is correct
      this.isCorrectColor(transcript);
    }
  }

  isCorrectColor(transcript) {
    const currentColorName = this.state.currentColorName;
    const synonymsList = voiceHandler.getSynonyms(currentColorName);
    const isCorrect =
      transcript.includes(currentColorName) ||
      synonymsList.some((syn) => transcript.includes(syn));

    if (isCorrect) {
      voiceHandler.speak(`Well done! The color is ${currentColorName}.`);
    } else if (Object.keys(colors).some((color) => transcript.includes(color))) {
      voiceHandler.speak('Try again.');
    }
  }

  startGame() {
    console.log('Game started');
    this.cleanupRecognition(); // Ensure any previous session is properly stopped
    this.setState({ gameStarted: true }, () => {
      this.setupRecognition(); // Reinitialize recognition to ensure clean start
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
    }, 500); // Adding delay to ensure recognition fully stops before resetting
  }

  render() {
    if (this.state.navigateToHome) {
      return <Navigate to="/" />;
    }

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
        </div>
      </div>
    );
  }
}

export default ColorGame;
