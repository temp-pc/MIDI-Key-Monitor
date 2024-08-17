const noteCharList = [ "A", "As", "B", "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs"];
const baseNote = {
  "C": 0,
  "Cs": 1,
  "D": 2,
  "Ds": 3,
  "E": 4,
  "F": 5,
  "Fs": 6,
  "G": 7,
  "Gs": 8,
  "A": 9,
  "As": 10,
  "B": 11
};

const pianoContainer = document.querySelector("#piano-container");
const pianoBackground = document.querySelector('#piano-background');
const numberOfKeysSelector = document.querySelector("#numberOfKeysSelector");
for (let i = 1; i <= 88; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  numberOfKeysSelector.appendChild(option);
}
numberOfKeysSelector.addEventListener("change", (event) => {
  const selectedValue = parseInt(event.target.value);
  createKeys(selectedValue);
})


let octaveShiftStatus = 0;
const initialNumberOfKeys = 24;
numberOfKeysSelector.value = initialNumberOfKeys;  //キーボードの鍵盤数の初期値を設定。

const initialFirstNotePitch = "A3";

function noteToMidi(note) {
  const match = note.match(/^([A-G][s]?)(\d)$/);
  if (!match) return null;

  const [ , pitch, octave ] = match;
  const pitchIndex = noteCharList.indexOf(pitch);
  if (pitchIndex === -1) return null;

  return (parseInt(octave) + 1) * 12 + baseNote[pitch] ;
}
function midiToNote(midiNumber) {
  const octave = Math.floor(midiNumber / 12) - 1;
  const pitchIndex = midiNumber % 12;

  const pitch = noteCharList.find((n, index) => baseNote[n] === pitchIndex);
  if (!pitch) return null;

  return `${pitch}${octave}`;
}


createKeys(initialNumberOfKeys);


function createKeys(numberOfKeys) {
  pianoBackground.innerHTML = ''; //初期化
 
  const whiteKeyWidth = 3.2; // 単位はem
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyWidthhalf = blackKeyWidth / 2;
  const GapOfBlackKey = whiteKeyWidth / 8; //黒鍵の位置を真ん中から少しずらす
  const pianoContainerPadding = 1;
  const blackKeyIndexList = [2, 4, 7, 9, 11];
  const oneOctaveWidth = whiteKeyWidth * 7;
  const firstNotePitch = "C4";
  const firstNoteMidiNumber = noteToMidi(firstNotePitch);
  const firstNoteMatch = firstNotePitch.match(/^([A-G][s]?)(\d)$/);
  let whiteKeyCount = 0;
  const [ , firstNoteChar, firstNoteOctave ] = firstNoteMatch;
  let pianoBackgroundWidth = 0;

  for (let num = 1; num <= numberOfKeys; num++) {
    const div = document.createElement("div");
    const noteMidiNumber = firstNoteMidiNumber + num - 1;
    const notePitch = midiToNote(noteMidiNumber);
    const match = notePitch.match(/^([A-G][s]?)(\d)$/);
    const [ , noteChar, noteOctave ] = match;
    
    div.setAttribute("data-note", noteMidiNumber);
    div.classList.add("key");
    div.id = notePitch;

    keyIndex = num % 12;
    const octave = Math.floor( num / 12) + 1;

    if (noteChar.includes("s")) {

      div.classList.add("black-key");
      div.style.width = `${blackKeyWidth}em`;

      let blackKeyPosition = whiteKeyWidth * whiteKeyCount - blackKeyWidthhalf;

      // ギャップの調整
      if (noteChar === "Cs" || noteChar === "Fs") {
        blackKeyPosition -= GapOfBlackKey;
      }else if(noteChar === "Ds" || noteChar === "As"){
        blackKeyPosition += GapOfBlackKey;
      }
      div.style.left = `${blackKeyPosition}em`;

      //黒鍵で終わってたら、その分piano-containerのサイズを大きくする
      if(num == 1 || num == numberOfKeys){
        pianoBackgroundWidth += blackKeyWidth;
      }
    } else {

      div.classList.add("white-key");
      div.style.width = `${whiteKeyWidth}em`;
      whiteKeyCount += 1;
      pianoBackgroundWidth += whiteKeyWidth;
    }

    pianoBackground.appendChild(div);
  }
  pianoBackground.style.width = `${pianoBackgroundWidth}em`;
}


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


