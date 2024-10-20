const voiceHandler = {
  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const defaultVoice = voices.find(voice => voice.name.includes('Microsoft David')) || voices[0];
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
  },

  setupRecognition(onResult) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = event => {
      const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
      onResult(transcript);
    };
    return recognition;
  },

  startRecognition(recognitionInstance) {
    recognitionInstance.start();
  },

  stopRecognition(recognitionInstance) {
    recognitionInstance.stop();
  },

  browserSupportsSpeechRecognition() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
};

export default voiceHandler;
