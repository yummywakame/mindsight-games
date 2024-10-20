import Cookies from 'js-cookie';

const voices = window.speechSynthesis.getVoices();
const defaultVoice = voices.find(voice => voice.name.includes('Microsoft David')) || voices[0];

const voiceHandler = {
  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = defaultVoice;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  },

  getSynonyms(color) {
    const synonyms = {
      purple: ['violet', 'lavender'],
      blue: ['azure', 'navy', 'sky'],
      yellow: ['gold', 'amber'],
      red: ['crimson', 'scarlet'],
      green: ['lime', 'forest'],
      pink: ['fuchsia', 'rose'],
      black: ['ebony'],
      white: ['ivory'],
      gray: ['silver'],
      orange: ['peach', 'tangerine']
    };

    return synonyms[color] || [];
  }
};

export default voiceHandler;
