//Global
const MAX_CHARS = 150;

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');

const renderFeedbackItem = feedbackItem => {
  const feedbackItemHTML = `
  <li class="feedback">
    <button class="upvote">
        <i class="fa-solid fa-caret-up upvote__icon"></i>
        <span class="upvote__count">${feedbackItem.upvoteCount}</span>
    </button>
    <section class="feedback__badge">
        <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
    </section>
    <div class="feedback__content">
        <p class="feedback__company">${feedbackItem.company}</p>
        <p class="feedback__text">${feedbackItem.text}</p>
    </div>
    <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
</li>
  `;

  //insert feedback item in list
  feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
}

//-- Counter Component --
const inputHandler = () => {
  //determine maximum number of chars
  const maxNrChars = MAX_CHARS;

  //determine number of chars user currently typed
  const nrCharsTyped = textareaEl.value.length;

  //calculate number of chars user has left (max - currently typed)
  const charsLeft = maxNrChars - nrCharsTyped;

  //show number of chars left
  counterEl.textContent = charsLeft;

};

textareaEl.addEventListener('input', inputHandler);



//Form Component
const showVisualIndicator = textCheck => {
  const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
  //show valid indicator
  formEl.classList.add(className);

  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
}

const submitHander = event => {
  //prevent default browser action (submitting form data to action address)
  event.preventDefault();

  //get text from text area
  const text = textareaEl.value;

  //validate text (if # is present and text is long enough)
  if (text.includes('#') && text.length >= 5) {
    showVisualIndicator('valid');
  } else {
    showVisualIndicator('invalid');

    //focus text area
    textareaEl.focus();

    //stop this function execution
    return;
  }

  //extract other info from text
  const hashtag = text.split(' ').find(word => word.includes('#'));
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;


  //create feeback item object
  const feedbackItem = {
    upvoteCount: upvoteCount,
    company: company,
    badgeLetter: badgeLetter,
    daysAgo: daysAgo,
    text: text
  };
  //render feedback item
  renderFeedbackItem(feedbackItem);

  //clear textarea
  textareaEl.value = '';
  //blur submit button
  submitBtnEl.blur();
  //reset counter
  counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHander)


//Feedback List Component
fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks')
  .then(response => response.json())
  .then(data => {
    //remove spinner
    spinnerEl.remove();
    //iterate over each element in feedback array and render in list
    data.feedbacks.forEach(feedbackItem => {
renderFeedbackItem(feedbackItem);
    });
  }).catch(error => {
    feedbackListEl.textContent = `Failed to fetch feedback items. Error Message: ${error.message}`
  })