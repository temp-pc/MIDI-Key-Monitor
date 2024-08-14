if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);
} else {
  console.log("WebMIDI is not supported in this browser.");
}

function onMIDISuccess(midiAccess) {
  midiAccess.inputs.forEach(function (input) {
      input.onmidimessage = onMIDIMessage;
  });
}

function onMIDIFailure() {
  console.log("Failed to access MIDI devices.");
}

function onMIDIMessage(message) {
  const [status, note, velocity] = message.data;
  const isNoteOn = (status & 0xf0) === 0x90;
  const isNoteOff = (status & 0xf0) === 0x80 || (isNoteOn && velocity === 0);
  const key = document.querySelector(`.key[data-note="${note}"]`);

  if (isNoteOn) {
      key.classList.add('active');
  } else if (isNoteOff) {
      key.classList.remove('active');
  }
}
