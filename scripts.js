document.querySelectorAll('.nav-skinny a').forEach(icon => {
    icon.addEventListener('click', function() {
        const target = document.querySelector(this.dataset.target);

        // Toggle navigation panels
        document.querySelectorAll('.expanded-nav').forEach(nav => {
            if (nav !== target) nav.classList.remove('open');
        });
        target.classList.toggle('open');

        // Highlight selected icon
        document.querySelectorAll('.nav-skinny a').forEach(navIcon => {
            navIcon.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Close any open expanded navigation panels when clicking on the main content
document.querySelector('.main-content').addEventListener('click', function() {
    document.querySelectorAll('.expanded-nav').forEach(nav => {
        nav.classList.remove('open');
    });
});


//Initialize WYSIIWYG
const quill = new Quill('#editor', {
    theme: 'snow'
  });

// Select the icon element
const icon = document.getElementById('chatIcon');

// Add a click event to stop the animation
icon.addEventListener('click', () => {
    icon.classList.remove('flash'); // Remove the flashing animation
    icon.classList.add('clicked'); // Ensure the background returns to its original
});



/*
"What is the purpose of this letter of recommendation? (e.g., college admission, scholarship, job application, etc.)?",
"What is the student's full name?",
"How long have you known the student?",
"In what capacity do you know the student?",
"What are the student's strongest academic skills?",
"What personal qualities or characteristics make this student stand out?",
"Tell me about this student. What would you like to include in the letter?",
*/


//CHAT
const chatBody = document.querySelector(".card-body");
const inputField = document.querySelector(".form-control");
const sendButton = document.querySelector(".btn");
const chatContainer = document.querySelector(".expanded-nav"); // Updated to scroll the right container
const editorDiv = document.querySelector("#editor");
let currentQuestionIndex = 0;
const responses = [];

// Questions for the chat
const questions = [
    "What is this letter of recommendation for?",
    "What is the name of the student?",
    "Tell me about this student. What would you like to include in the letter?",
];

function addMessage(message, type = "question") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("d-flex", "mb-3");
    if (type === "response") {
        messageDiv.classList.add("justify-content-end");
    }

    const bubble = document.createElement("div");
    bubble.classList.add("p-3", "rounded");
    bubble.classList.add(type === "response" ? "bg-primary" : "bg-light");
    bubble.classList.add(type === "response" ? "text-white" : "text-dark");
    bubble.innerText = message;

    messageDiv.appendChild(bubble);
    chatBody.appendChild(messageDiv);
    
    // Ensure smooth scrolling to the bottom
    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: 'smooth'
    });
}

// Function to simulate the chatbot thinking
function showThinking(callback) {
    const thinkingDiv = document.createElement("div");
    thinkingDiv.classList.add("d-flex", "mb-3");

    const bubble = document.createElement("div");
    bubble.classList.add("p-3", "bg-light", "text-dark", "rounded");
    bubble.innerText = "...";
    thinkingDiv.appendChild(bubble);

    chatBody.appendChild(thinkingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom

    // Simulate delay, then remove thinking and call callback
    setTimeout(() => {
        chatBody.removeChild(thinkingDiv);
        callback();
    }, 1000); // Adjust the delay time for thinking
}

// Function to display the next question with delays
function displayNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        // Simulate reading the response by delaying before showing "..."
        setTimeout(() => {
            showThinking(() => {
                addMessage(questions[currentQuestionIndex]);
            });
        }, 500); // Adjust the delay time for "reading"
    } else {
        finishChat();
    }
}

// Function to finish the chat
function finishChat() {
    addMessage("Thank you! Please wait while we generate your letter of recommendation.");
    inputField.disabled = true;
    sendButton.disabled = true;

    // Show spinner
    showSpinner();

    // Populate editor after spinner
    setTimeout(() => {
        const editorContent = responses
            .map((response, index) => `${questions[index]} ${response}`)
            .join("\n\n");
        editorDiv.textContent = editorContent; // Insert responses into #editor div
    }, 3000); // Match spinner delay
}

// Function to show the spinner
function showSpinner() {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.classList.add("d-flex", "justify-content-center", "mb-3");
    spinnerDiv.innerHTML = `
        <div class="spinner-border custom-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    chatBody.appendChild(spinnerDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Remove spinner after LLM completes its task
    setTimeout(() => {
        chatBody.removeChild(spinnerDiv);
        addMessage("Your letter of recommendation is ready!", "question");
    }, 3000); // Adjust duration based on processing time
}

// Event listener for the send button
sendButton.addEventListener("click", () => {
    const userInput = inputField.value.trim();
    if (userInput === "") return;

    // Add user's response to chat
    addMessage(userInput, "response");
    responses.push(userInput);

    // Clear the input field
    inputField.value = "";

    // Increment question index and display next question
    currentQuestionIndex++;
    displayNextQuestion();
});

// Allow pressing "Enter" to send a message
inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});

// Start the chat
displayNextQuestion();
