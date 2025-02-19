const socket = io(window.location.origin);

socket.on("connect", () => {
    console.log("Connected to WebSocket");
});

socket.on("new_message", (data) => {
    console.log("New message received:", data);
    fetchMessages(); // Function to pull the latest messages
});

function createMessage(message, timestamp, author) {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
	
    const authorElement = document.createElement("span");
    authorElement.innerText = author;
    authorElement.className = "author";
    messageElement.appendChild(authorElement);

    const timestampElement = document.createElement("span");
    timestampElement.innerText = timestamp;
    timestampElement.className = "timestamp";
    messageElement.appendChild(timestampElement);

    const messageTextElement = document.createElement("p");
    messageTextElement.innerText = message;
    messageElement.appendChild(messageTextElement);

    return messageElement;
}

function fetchMessages() {
    fetch("/api/get/msg") // Replace with your API to fetch messages
        .then((response) => response.json())
        .then((data) => {
            console.log("Updated messages:", data);

            const messagesElement = document.getElementById("chat");
            messagesElement.innerHTML = "";
            data.forEach((message) => {
                const messageElement = createMessage(
                    message.message,
                    message.timestamp,
                    message.author
                );
                messagesElement.appendChild(messageElement);
            });
        });
}

function sendMessage() {
    if (document.getElementById("message").value.trim() === "") return;
    if (document.getElementById("username").value.trim() === "") {
        alert("Please enter a username before sending a message.");
        return;
    }

    const message = document.getElementById("message").value;
    const author = document.getElementById("username").value.trim();
    document.getElementById("message").value = "";
    fetch("/api/post/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message, author: author }),
    })
        .then((response) => response.text())
        .then((data) => {
            if (data.success) {
                fetchMessages(); // Function to pull the latest messages
            } else if (data.error) {
                alert(`Error sending message: ${data.error}`);
            }
        });
}

document.getElementById("send").addEventListener("click", () => {
    sendMessage();
});

document.getElementById("message").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        if (event.shiftKey) return;
        if (event.ctrlKey) return;
        if (event.altKey) return;
        sendMessage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchMessages();
});
