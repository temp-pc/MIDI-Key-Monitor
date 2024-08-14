
const pianoContainer = document.querySelector("#piano-container");

const numberOfKeysSelector = document.querySelector("#numberOfKeysSelector");
for (let i = 1; i <= 100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  numberOfKeysSelector.appendChild(option);
}

initialNumberOfKeys = 24;
numberOfKeysSelector.value = initialNumberOfKeys;  //キーボードの鍵盤数の初期値を設定。
createKeys(initialNumberOfKeys)

numberOfKeysSelector.addEventListener("change", (event) => {
  const selectedValue = parseInt(event.target.value);
  createKeys(selectedValue);
})



function createKeys(numberOfKeys) {
  const quotient = Math.floor(numberOfKeys / 12), remainder = numberOfKeys % 12;
  let black_keys_count = remainder < 2 ? 0 : remainder < 4 ? 1 : remainder < 7 ? 2 : remainder < 9 ? 3 : remainder < 11 ? 4 : 5;
  black_keys_count = quotient * 5 + black_keys_count;
  console.log("quotient : " + quotient + " remainder : " + remainder + " black_keys : " + black_keys_count)

  const blackKeyWidth = 2.5;  // 単位はem
  const GapOfBlackKey = 0.5; //黒鍵の位置を真ん中から少しずらす
  const whiteKeyWidth = 4;
  const pianoContainerPadding = 1;

  //24keys
  // for (let num = 1; num <= numberOfKeys; num++) {
  //   let div = document.createElement("div");
  //   div.classList.add("key", num <= black_keys_count ? "black-key" : "white-key");

  //   let blackKeyIndex = ( num + 5 ) % 5;
  //   let blackKeyPosition = 0;
  //   if(num <= black_keys_count){

  //     if(blackKeyIndex == 1){
  //       blackKeyPosition = ( whiteKeyWidth * num ) - ( blackKeyWidth / 2 ) - GapOfBlackKey;
  //     }else if(blackKeyIndex == 2){
  //       blackKeyPosition = ( whiteKeyWidth * num ) - ( blackKeyWidth / 2 ) + GapOfBlackKey;
  //     }else if(blackKeyIndex == 3){
  //       blackKeyPosition = ( whiteKeyWidth * (num+1) ) - ( blackKeyWidth / 2 ) - GapOfBlackKey;
  //     }else if(blackKeyIndex == 4){
  //       blackKeyPosition = ( whiteKeyWidth * (num+1) ) - ( blackKeyWidth / 2 );
  //     }else if(blackKeyIndex == 0){
  //       blackKeyPosition = ( whiteKeyWidth * (num+1) ) - ( blackKeyWidth / 2 ) + GapOfBlackKey;
  //     }

  //     div.style.width = `${blackKeyWidth}em`;
  //     div.style.left = `${blackKeyPosition + pianoContainerPadding}em`
  //     div.id = `black-key-${num}`

  //   }else{
  //     div.style.width = `${whiteKeyWidth}em`;
  //   }
  //   pianoContainer.appendChild(div);
  // }
  for (let num = 1; num <= numberOfKeys; num++) {
    let div = document.createElement("div");

    keyIndex = (num - 1) % 12
    const blackKeyIndexList = [1, 3, 6, 8, 10];
    if (blackKeyIndexList.includes(keyIndex)) {
      console.log(keyIndex);
      div.classList.add("black-key");
      div.style.width = `${blackKeyWidth}em`;
      if (keyIndex == 1) {
        blackKeyPosition = (whiteKeyWidth * num) - (blackKeyWidth / 2) - GapOfBlackKey;
      } else if (keyIndex == 2) {
        blackKeyPosition = (whiteKeyWidth * num) - (blackKeyWidth / 2) + GapOfBlackKey;
      } else if (keyIndex == 3) {
        blackKeyPosition = (whiteKeyWidth * (num + 1)) - (blackKeyWidth / 2) - GapOfBlackKey;
      } else if (keyIndex == 4) {
        blackKeyPosition = (whiteKeyWidth * (num + 1)) - (blackKeyWidth / 2);
      } else if (keyIndex == 0) {
        blackKeyPosition = (whiteKeyWidth * (num + 1)) - (blackKeyWidth / 2) + GapOfBlackKey;
      }
      div.style.left = `${blackKeyPosition + pianoContainerPadding}em`
      div.id = `black-key-${num}`
    } else {
      console.log(keyIndex);
      div.classList.add("white-key");
      div.style.width = `${whiteKeyWidth}em`;
    }

    pianoContainer.appendChild(div);
  }
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


