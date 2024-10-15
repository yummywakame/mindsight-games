import Cookies from 'js-cookie';

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

class VoiceHandler {
  constructor() {
    this.voice = window.speechSynthesis.getVoices()[0]; // Default voice

    // Load preferences from cookies if available
    const savedPreferences = Cookies.get('voicePreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        if (parsedPreferences) {
          this.voiceGender = parsedPreferences.gender;
          this.voiceAccent = parsedPreferences.accent;
        }
      } catch (error) {
        console.error("Error parsing voicePreferences from cookies:", error);
      }
    }
  }

  speak = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = this.voice;
    synth.speak(utterance);
  };

  checkAnswer = (userInput, currentColor, colors) => {
    const matchedColor = Object.keys(colors).find(
      (color) =>
        userInput.includes(color) ||
        (synonyms[color] && synonyms[color].some((synonym) => userInput.includes(synonym)))
    );

    if (matchedColor && currentColor === colors[matchedColor]) {
      this.speak(`Well done! The color is ${matchedColor}.`);
    } else {
      this.speak(`Try again.`);
    }
  };

  getSynonyms(color) {
    return synonyms[color] || [];
  }
}

const voiceHandlerInstance = new VoiceHandler();
export default voiceHandlerInstance;
