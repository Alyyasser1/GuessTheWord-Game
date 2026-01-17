// Game-Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Aly`;

let numOfTries = 6;
let numOfLetters = 6;
let curTry = 1;
let numOfHints = 2;

let word = "";
let words = [
  "Create",
  "Listen",
  "School",
  "Garden",
  "Branch",
  "Master",
  "Delete",
];
word = words[Math.floor(Math.random() * words.length)].toLowerCase();

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");

  for (let i = 1; i <= numOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i != 1) tryDiv.classList.add("disabled");

    for (let j = 1; j <= numOfLetters; j++) {
      let inputField = document.createElement("input");
      inputField.type = "text";
      inputField.id = `guess-${i}-letter-${j}`;
      inputField.setAttribute("maxlength", "1");
      tryDiv.appendChild(inputField);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();

  //   Disable all inputs exept first one

  const inputsDisabled = document.querySelectorAll(".disabled input");
  inputsDisabled.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    //   convert inputs to upper case
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      // foucus on next input
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (event) {
      currIndex = Array.from(inputs).indexOf(this);
      if (event.key === "ArrowRight") {
        const nextIndex = currIndex + 1;
        if (nextIndex < inputs.length) inputs[nextIndex].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevIndex = currIndex - 1;
        if (prevIndex >= 0) inputs[prevIndex].focus();
      }
    });
  });
}
// Manage Hints
const hintBtn = document.querySelector(".hint");
document.querySelector(".hint span").innerHTML = numOfHints;
hintBtn.addEventListener("click", hintGenerator);
// massege
let massege = document.querySelector(".result");
// Manage ckeck
const check = document.querySelector(".check");
check.addEventListener("click", handleGuess);
function handleGuess() {
  let rightGuess = true;
  for (let i = 1; i <= numOfLetters; i++) {
    const inputLetter = document.querySelector(`#guess-${curTry}-letter-${i}`);
    const letterVal = inputLetter.value.toLowerCase();
    const actualLetter = word[i - 1];
    // Game Logic
    if (letterVal === actualLetter) {
      inputLetter.classList.add("in-place");
    } else if (word.includes(letterVal) && letterVal != "") {
      inputLetter.classList.add("not-in-place");
      rightGuess = false;
    } else {
      inputLetter.classList.add("wrong");
      rightGuess = false;
    }
  }
  //   Win
  if (rightGuess) {
    massege.innerHTML = `You Won Within <span>${curTry}</span> Tries`;
    // Disable Inputs And Button

    let allInputs = document.querySelectorAll(".inputs > div");
    allInputs.forEach((event) => event.classList.add("disabled"));

    hintBtn.classList.add("disabled");
    check.classList.add("disabled");
  }
  //   Lose
  else {
    // add disabled to finished try
    document.querySelector(`.try-${curTry}`).classList.add("disabled");
    const currElement = document.querySelectorAll(`.try-${curTry} input`);
    currElement.forEach((input) => (input.disabled = true));

    curTry++;
    // remove disabled from next try
    const nextElement = document.querySelectorAll(`.try-${curTry} input`);
    nextElement.forEach((input) => (input.disabled = false));

    const el = document.querySelector(`.try-${curTry}`);
    // check if there is tries remaining
    if (el) {
      document.querySelector(`.try-${curTry}`).classList.remove("disabled");
      el.children[1].focus();
    } else {
      hintBtn.classList.add("disabled");
      check.classList.add("disabled");
      massege.innerHTML = `Game Over The Word Is <span>${word}</span>`;
    }
  }
}
function hintGenerator() {
  if (numOfHints > 0) {
    numOfHints--;
    document.querySelector(".hint span").innerHTML = numOfHints;
  }
  if (numOfHints === 0) {
    hintBtn.classList.add("disabled");
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled]");
  const enabledEmptyInputs = Array.from(enabledInputs).filter(
    (input) => input.value === "",
  );

  if (enabledEmptyInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * enabledEmptyInputs.length);
    const randomInput = enabledEmptyInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = word[indexToFill].toUpperCase();
    }
  }
}
// Handle Backspace
function handleBackspace(event) {
  if (event.key === "Backspace") {
    event.preventDefault();
    const Inputs = document.querySelectorAll("input:not([disabled])");
    const currIndex = Array.from(Inputs).indexOf(document.activeElement);

    if (currIndex >= 0) {
      if (Inputs[currIndex].value !== "") {
        // If input has a word, delete it
        Inputs[currIndex].value = "";
      } else if (currIndex > 0) {
        // If input is empty, go back to previous input without deleting its content
        Inputs[currIndex - 1].focus();
      }
    }
  }
}
document.addEventListener("keydown", handleBackspace);
// Load Program
window.onload = function () {
  generateInputs();
};
