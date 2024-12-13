// DOM Elements
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const themeSwitch = document.getElementById("theme-switch");
const feedbackButton = document.querySelector(".feedback-button");

// Add message to chat window
function addMessage(content, isBot = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isBot ? "bot-message" : "user-message");

    if (isBot) {
        const messageText = document.createElement("span");
        messageText.classList.add("message-text");
        messageDiv.appendChild(messageText);

        // Typewriter effect for bot messages
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            messageText.textContent += content.charAt(charIndex);
            charIndex++;

            if (charIndex === content.length) {
                clearInterval(typeInterval);
            }
        }, 50);
    } else {
        messageDiv.textContent = content;
    }

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot-message", "typing-indicator");
    typingIndicator.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;
    chatWindow.appendChild(typingIndicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return typingIndicator;
}

// Remove typing indicator
function removeTypingIndicator(indicator) {
    chatWindow.removeChild(indicator);
}

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add user message
    addMessage(userMessage);

    // Clear input
    chatInput.value = "";

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    // Simulate fetching bot response
    try {
        const response = await fetch("https://backend-bt9s.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        });
        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator(typingIndicator);

        // Add bot message
        addMessage(data.reply, true);
    } catch (error) {
        console.error("Error fetching bot response:", error);

        // Remove typing indicator
        removeTypingIndicator(typingIndicator);

        // Show error message
        addMessage("Sorry, I couldn't connect to the server. Please try again.", true);
    }
});

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Attach event listener to theme switch
themeSwitch.addEventListener("change", toggleDarkMode);

// Feedback Button Click Handler
feedbackButton.addEventListener("click", () => {
    const feedback = prompt("Please provide your feedback:", "");
    if (feedback) {
        alert("Thank you for your feedback!");
        console.log("User Feedback:", feedback); // Log feedback to console
    } else {
        alert("Feedback canceled.");
    }
});
