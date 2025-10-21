const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const loadingIndicator = document.getElementById("loading-indicator");

// Scroll to the latest message
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add a message to the chat
function appendMessage(sender, message) {
  // Outer container for alignment
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "flex justify-end mb-2" : "flex justify-start mb-2";

  // Inner bubble
  const bubble = document.createElement("div");
  bubble.className = `p-3 rounded-xl shadow-lg max-w-xs md:max-w-md ${
    sender === "user"
      ? "bg-gray-600 text-gray-50 rounded-br-none"
      : "bg-indigo-600/20 text-indigo-200 rounded-tl-none"
  }`;

  // Simple markdown: **bold**, *italic*, - list
  bubble.innerHTML = message
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)/gm, "<li>$1</li>");

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  scrollToBottom();
}

// Send message to backend
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";
  userInput.disabled = sendButton.disabled = true;
  loadingIndicator.classList.remove("hidden");
  scrollToBottom();

  try {
    const response = await fetch("/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    appendMessage("ai", data.reply);
  } catch (error) {
    appendMessage("ai", "Error: Could not connect to AI service.");
    console.error(error);
  } finally {
    userInput.disabled = sendButton.disabled = false;
    loadingIndicator.classList.add("hidden");
    userInput.focus();
    scrollToBottom();
  }
}

// Focus input on page load
document.addEventListener("DOMContentLoaded", () => userInput.focus());