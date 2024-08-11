

let pianoContainer = document.getElementsByClassName("piano-container");
window.onload = () => {
  const pianoPadding = 1; //単位：em
  const keys = 13;
  const quotient = Math.floor(keys / 12), remainder = keys % 12;
  let black_keys_count = remainder < 2 ? 0 : remainder < 4 ? 1 : remainder < 7 ? 2 : remainder < 9 ? 3 : remainder < 11 ? 4 : 5 ;
  black_keys_count = quotient * 5 + black_keys_count;
  console.log("quotient : " + quotient + " remainder : " + remainder + " black_keys : " + black_keys_count)

  //24keys
  for (let index = 1; index <= keys; index++) {
    let div = document.createElement("div");
    div.classList.add("key", index <= black_keys_count ? "black-key" : "white-key");
    let emNum = 0;
    if(index <= black_keys_count){
      if(index == 1){
        emNum = 3;
      }else if(index == 2){
        emNum = 8;
      }else if(index == 3){
        emNum = 15;
      }else if(index == 4){
        emNum = 20;
      }else if(index == 5){
        emNum = 25;
      }else if(index == 6){
        emNum = 25;
      }
      div.style.left = `${emNum}em`
    }
    //For playing audio on click
    // const number = index <= black_keys_count - 1 ? "0" + index : index;
    // div.addEventListener("click", () => {
    //   new Audio(`${base}key${number}.mp3`).play();
    // });
    pianoContainer[0].appendChild(div);
  }
};

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


