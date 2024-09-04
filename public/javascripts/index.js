// helper function for creating elements (usage optional)
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  // add element attributes
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  // add child nodes to element
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));

  return ele;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://anonymous-qna.vercel.app/questions');
    const questions = await response.json();

    // console.log(questions);

    // Handle the data and update the DOM
    const contentElement = document.getElementById('content');
    const modalQuestion = document.getElementById('modal-question');
    const modalAnswer = document.getElementById('modal-answer');

    
    // Function to create a list item for an answer
    function createAnswerListItem(answer) {
      const answerItem = createElement('li', null, answer);
      return answerItem;
    }

    // Iterate through each question in the JSON response
    questions.forEach(question => {
      // Create elements for the question
      const questionElement = createElement('h2', null, question.question);

      // Create an unordered list for answers
      const answersList = createElement('ul');

      // Iterate through each answer in the question
      question.answers.forEach(answer => {
        // Create list item for each answer
        const answerItem = createAnswerListItem(answer);

        // Append the answer item to the answers list
        answersList.appendChild(answerItem);
      });

      // Create a button to add an answer
      const addButton = createElement('button', { type: 'button', class: 'add-answer-button', 'data-question-id': question._id }, 'Add an Answer');
      addButton.addEventListener('click', () => {
        // Show the modal for adding an answer
        modalAnswer.style.display = 'block';
        // Set the question ID for the current question (for future reference)
        document.getElementById('question-id').value = question._id;
      });

      // Append question element, answers list, and add button to the content element
      contentElement.appendChild(questionElement);
      contentElement.appendChild(answersList);
      contentElement.appendChild(addButton);
    });

    // Sample implementation for "Ask a Question" button click
    const askButton = document.getElementById('btn-show-modal-question');

    askButton.addEventListener('click', () => {
      // Show the modal for asking a question
      modalQuestion.style.display = 'block';
    });

    // Event listener for form submission in the ask question modal
    const questionForm = document.getElementById('create-question');
    questionForm.addEventListener('click', async (event) => {
      
      event.preventDefault();

      // Collect the form data (just the question text)
      const questionText = document.getElementById('question-text').value;
      console.log("Question form submitted", questionText);

      // Use AJAX POST to send the question text to the server
      try {
        const response = await fetch('https://anonymous-qna.vercel.app/questions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: questionText }),
        });
        // Log information after receiving the response
        console.log('Server response:', response.status, response.statusText);


        const data = await response.json();

        // Handle successful result (add question text to the page, etc.)
        console.log("Data", data);

        // Close the modal
        modalQuestion.style.display = 'none';
        // Clear the form
        document.getElementById('question-text').value = '';
        location.reload();
      } catch (error) {
        // Handle failure (log error, display error message, etc.)
        console.error('Error asking a question:', error);
      }
    });

    // Event listener for form submission in the add answer modal
    const answerForm = document.getElementById('create-answer');
    answerForm.addEventListener('click', async (event) => {
      event.preventDefault();
      console.log("Answer form submitted");

      // Collect the form data (just the answer text)
      const answerText = document.getElementById('answer-text').value;
      // Collect the question ID
      const questionId = document.getElementById('question-id').value;

      // Use AJAX POST to send the answer text to the server
      try {
        const response = await fetch(`https://anonymous-qna.vercel.app/questions/${questionId}/answers/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer: answerText }),
        });
        console.log("Answer sent to server");
        const data = await response.json();

        // Handle successful result (add answer text to the page, etc.)
        console.log('Server response', data);
        // Close the modal
        modalAnswer.style.display = 'none';
        // Clear the form
        document.getElementById('answer-text').value = '';
        document.getElementById('question-id').value = '';
        location.reload();
      } catch (error) {
        // Handle failure (log error, display error message, etc.)
        console.error('Error adding an answer:', error);
      }
    }); 

    // Add this inside your existing "Close" button event listener for the modals
    const closeQuestionButton = document.querySelector('#modal-question .close');
    closeQuestionButton.addEventListener('click', () => {
      // Hide the modal for asking a question
      modalQuestion.style.display = 'none';
      // Clear the form
      document.getElementById('question-text').value = '';
    });

    
    const closeAnswerButton = document.querySelector('#modal-answer .close');
    closeAnswerButton.addEventListener('click', () => {
      // Hide the modal for adding an answer
      modalAnswer.style.display = 'none';
      // Clear the form
      document.getElementById('answer-text').value = '';
      document.getElementById('question-id').value = '';
    }); 
    

   /*
    // Event delegation for "Add an Answer" buttons
    contentElement.addEventListener('click', (event) => {
      if (event.target.matches('.add-answer-button')) {
        // Retrieve the question ID from the data attribute
        const questionId = event.target.getAttribute('data-question-id');
        console.log('Add an Answer button clicked for question ID:', questionId);

        // Show the modal for adding an answer
        modalAnswer.style.display = 'block';
        // Set the question ID for the current question (for future reference)
        document.getElementById('question-id').value = questionId;
      }
    });

    */

  } catch (error) {
    console.log('Error fetching questions:', error);
    // Add more robust error handling if desired
  }
});
