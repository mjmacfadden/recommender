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


//CHAT

const chatBody = document.querySelector(".card-body");
const inputField = document.querySelector(".form-control");
const sendButton = document.querySelector(".btn");
let currentQuestionIndex = 0;
const responses = [];

// Questions for the chat
const questions = [
    "What is this letter of recommendation for?",
    "What is the name of the student?",
    "Tell me about this student. What would you like to include in the letter?",
];

// Function to add a message to the chat
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
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to the bottom
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
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to the bottom

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
    addMessage("Thank you! Your responses have been saved.");
    inputField.disabled = true;
    sendButton.disabled = true;
    console.log("Final Responses:", responses); // Save these to your backend or process further
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

// Start the chat
displayNextQuestion();
