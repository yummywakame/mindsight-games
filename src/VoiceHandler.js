import Cookies from 'js-cookie'; // Import Cookies

const voices = window.speechSynthesis.getVoices();

function getVoice(accent, gender) {
  const voiceGender = gender === 'female' ? 'female' : 'male';
  const voiceAccent = accent === 'british' ? 'en-GB' : 'en-US'; // en-GB for British, en-US for American

  const selectedVoice = voices.find(voice =>
    voice.lang.includes(voiceAccent) && voice.name.toLowerCase().includes(voiceGender)
  );

  return selectedVoice || voices[0]; // Fallback to first voice if none found
}

function speak(text) {
  const accent = Cookies.get('accent') || 'american'; // Default to American if no cookie
  const gender = Cookies.get('gender') || 'male'; // Default to Male if no cookie

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getVoice(accent, gender); // Use selected voice
  window.speechSynthesis.speak(utterance);
}

const voiceHandler = { speak, getVoice }; // Assign to a variable before export

export default voiceHandler; // Export module
