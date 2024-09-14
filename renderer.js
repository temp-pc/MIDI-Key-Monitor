const noteCharList = ["A", "As", "B", "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs"];
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

  const [, pitch, octave] = match;
  const pitchIndex = noteCharList.indexOf(pitch);
  if (pitchIndex === -1) return null;

  return (parseInt(octave) + 1) * 12 + baseNote[pitch];
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

  // const whiteKeyWidth = 3.2; // 単位はem
  const whiteKeyWidth = numberOfKeys <= 36 ? 3.2 : numberOfKeys <= 60 ? 2.6 : 2.0;
  // const whiteKeyWidth = 80 / numberOfKeys ; // 単位はem
  // const whiteKeyWidthWithBorder = whiteKeyWidth + 0.01;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyWidthhalf = blackKeyWidth / 2;
  const GapOfBlackKey = whiteKeyWidth / 20; //黒鍵の位置を真ん中から少しずらす
  const firstNotePitch = numberOfKeys <= 12 ? "C4" : numberOfKeys <= 24 ? "C3" : numberOfKeys <= 49 ? "C2" : "C1";
  // const firstNotePitch = "C4";
  const firstNoteMidiNumber = noteToMidi(firstNotePitch);
  let whiteKeyCount = 0;
  let pianoBackgroundWidth = 0;

  for (let num = 1; num <= numberOfKeys; num++) {
    const div = document.createElement("div");
    const noteMidiNumber = firstNoteMidiNumber + num - 1;
    const notePitch = midiToNote(noteMidiNumber);
    const match = notePitch.match(/^([A-G][s]?)(\d)$/);
    const [, noteChar, noteOctave] = match;

    div.setAttribute("data-note", noteMidiNumber);
    div.classList.add("key");
    div.id = notePitch;

    keyIndex = num % 12;

    if (noteChar.includes("s")) {

      div.classList.add("black-key");
      div.style.width = `${blackKeyWidth}em`;

      let blackKeyPosition = whiteKeyWidth * whiteKeyCount - blackKeyWidthhalf;

      // ギャップの調整
      if (noteChar === "Cs" || noteChar === "Fs") {
        blackKeyPosition -= GapOfBlackKey;
      } else if (noteChar === "Ds" || noteChar === "As") {
        blackKeyPosition += GapOfBlackKey;
      }
      div.style.left = `${blackKeyPosition}em`;

      //黒鍵で終わってたら、その分piano-containerのサイズを大きくする
      if (num == 1 || num == numberOfKeys) {
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

  const notePitchSymbol = midiToNote(note);
  const match = notePitchSymbol.match(/^([A-G][s]?)(\d)$/);
  const [, noteChar, ] = match;
  const summaryKey = document.querySelector(`#summary-key-${noteChar}`);

  if (isNoteOn) {
    key.classList.add('active');
    summaryKey.classList.add('active');
  } else if (isNoteOff) {
    key.classList.remove('active');
    summaryKey.classList.remove('active');
  }
}






const summaryPianoContiner = document.querySelector("#summary-piano");
createSummaryKey()
function createSummaryKey() {
  const notes = Object.keys(baseNote);
  const summaryWhiteKeyWidth = 3.2; // 単位はem
  summaryPianoContiner.style.width = `${summaryWhiteKeyWidth*7}em`;
  const summaryBlackKeyWidth = summaryWhiteKeyWidth * 0.6;
  const summaryBlackKeyWidthHalf = summaryBlackKeyWidth / 2;
  const GapOfBlackKey = summaryWhiteKeyWidth / 20; //黒鍵の位置を真ん中から少しずらす
  let whiteKeyCount = 0;
  let pianoBackgroundWidth = 0;

  notes.forEach((note) => {
    const div = document.createElement("div");
    div.id = `summary-key-${note}`;
    div.classList.add("key");
    if (note.includes("s")) {
      div.classList.add("summary-black-key");
      let blackKeyPosition = 0;
      if (note === "Cs") {
        blackKeyPosition = summaryWhiteKeyWidth * 1 - summaryBlackKeyWidthHalf;
      } else if (note === "Ds") {
        blackKeyPosition = summaryWhiteKeyWidth * 2 - summaryBlackKeyWidthHalf;
      } else if (note === "Fs") {
        blackKeyPosition = summaryWhiteKeyWidth * 4 - summaryBlackKeyWidthHalf;
      } else if (note === "Gs") {
        blackKeyPosition = summaryWhiteKeyWidth * 5 - summaryBlackKeyWidthHalf;
      } else if (note === "As") {
        blackKeyPosition = summaryWhiteKeyWidth * 6 - summaryBlackKeyWidthHalf;
      }
      div.style.left = `${blackKeyPosition }em`;
    } else {
      div.classList.add("summary-white-key");
      div.style.width = `${summaryWhiteKeyWidth}em`;
    }
    summaryPianoContiner.appendChild(div);
  })
  
}


function playNote(note) {
  const midiNote = parseInt(note); // noteがMIDI番号ならそのまま変換

  // Note On メッセージの作成 (チャンネル1, 音の高さ, ベロシティ)
  const noteOnMessage = [0x90, midiNote, 127];
  onMIDIMessage({ data: noteOnMessage });

  // Note Off メッセージを少し遅らせて実行（例: 500ms後）
  setTimeout(() => {
    const noteOffMessage = [0x80, midiNote, 0];
    onMIDIMessage({ data: noteOffMessage });
  }, 500);
}

// イベントリスナー内でplayNoteWithSoundを呼び出すように変更
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    const note = key.getAttribute('data-note');
    playNote(note);
  });
});