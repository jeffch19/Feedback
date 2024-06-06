//Global
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api'

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');

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


  //render feedback item in list
  const feedbackItem = {
    upvoteCount: upvoteCount,
    company: company,
    badgeLetter: badgeLetter,
    daysAgo: daysAgo,
    text: text
  };
  //render feedback item
  renderFeedbackItem(feedbackItem);

  //send feedback item to server
  fetch(`${BASE_API_URL}/feedbacks`, {
    method: 'POST',
    body: JSON.stringify(feedbackItem),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      console.log('Something went wrong');
      return;
    } else {
      console.log("Successfully Submitted");
    }
  }).catch(err => console.log(err));


  //clear textarea
  textareaEl.value = '';
  //blur submit button
  submitBtnEl.blur();
  //reset counter
  counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHander)


//Feedback List Component
(() => {
  const clickHandler = event => {
    const clickedEl = event.target;
  
    //determine if user intended to upvote or expand
    const upvoteIntention = clickedEl.className.includes("upvote");
    //run appropriate logic
    if (upvoteIntention) {
      //get upvote button
      const upVoteButtonEl = clickedEl.closest('.upvote')
      //disable upvote button so user cant click multiple times
      upVoteButtonEl.disabled = true;
  
      //select the upvote count element within the upvote button
      const upvoteCountEl = upVoteButtonEl.querySelector('.upvote__count');
  
      //get currently displayed upvote count as a number (+)
      let upvoteCount = +upvoteCountEl.textContent;
  
      //set upvote count in HTML
      upvoteCount.textContent = ++upvoteCount;
  
  
    } else {
      //expand clicked feedback item
      clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }
  }
  
  feedbackListEl.addEventListener('click', clickHandler)

  fetch(`${BASE_API_URL}/feedbacks`)
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
})();





  // last component Hashtag -----------
  (() => {
    const clickHandler = event => {
      // Get the clicked element
      const clickedEl = event.target;
    
      // Stop function if click happens in list, but outside buttons
      if (clickedEl.className === 'hashtags') return;
    
      // Extract company name from the clicked hashtag
      const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();
    
      // Iterate over each feedback item in the list
      feedbackListEl.childNodes.forEach(childNode => {
        // Stop this iteration if it's a text node
        if (childNode.nodeType === 3) return;
    
        // Extract company name from the feedback item
        const companyNameFromAFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
    
        // Now you can safely compare companyNameFromHashtag with companyNameFromAFeedbackItem
        if (companyNameFromHashtag!== companyNameFromAFeedbackItem) {
          childNode.remove(); // Remove the feedback item if the companies don't match
        }
      });
    }
    
    // Attach the event listener to the correct element
    hashtagListEl.addEventListener('click', clickHandler);
  })();
