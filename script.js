//-- Counter Component --
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');

const inputHandler = () => {
  //determine maximum number of chars
  const maxNrChars = 150;

  //determine number of chars user currently typed
  const nrCharsTyped = textareaEl.value.length;

  //calculate number of chars user has left (max - currently typed)
  const charsLeft = maxNrChars - nrCharsTyped;

  //show number of chars left
  counterEl.textContent = charsLeft;

};

textareaEl.addEventListener('input', inputHandler);