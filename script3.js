const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const drawButton = document.getElementById('draw');
const eraseButton = document.getElementById('erase');
const textButton = document.getElementById('text');
const clearButton = document.getElementById('clear');
const sizeInput = document.getElementById('size');
const textInput = document.createElement('textarea'); // Changed to a textarea for better text input
const eraserSizeDisplay = document.createElement('div'); // Create a div to display the eraser size

let painting = false;
let erasing = false;
let textMode = false;
let lineWidth = sizeInput.value;
const canvasBgColor = '#fafafa'; // Set the canvas background color to match the CSS
const fontSize = 20; // Set the font size

textInput.id = 'text-input';
eraserSizeDisplay.id = 'eraser-size';
document.body.appendChild(textInput);
document.body.appendChild(eraserSizeDisplay);

// Chat variables
const usernameInput = document.getElementById('username-input');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');
const chatBox = document.getElementById('chat-box');

// To-Do variables
const todoUsernameInput = document.getElementById('todo-username');
const todoStatus = document.getElementById('todo-status');
const addTodoButton = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

// Track attendance status to ensure only one entry per student
const attendance = new Set();

function startPosition(e) {
    if (textMode) {
        showTextInput(e);
    } else {
        painting = true;
        draw(e);
    }
}

function endPosition() {
    painting = false;
    ctx.beginPath(); // Begin a new path for the next line
}

function draw(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    if (erasing) {
        ctx.strokeStyle = canvasBgColor; // Erase with canvas background color
        updateEraserSizeDisplay(e); // Update the eraser size display
    } else {
        ctx.strokeStyle = 'black'; // Draw with black color
    }

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function showTextInput(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
        return; // Exit if the click is outside the canvas
    }

    textInput.style.left = `${e.clientX}px`;
    textInput.style.top = `${e.clientY}px`;
    textInput.style.display = 'block';
    textInput.focus();
}

function placeText(e) {
    if (e.key === 'Enter' && textMode) {
        const rect = canvas.getBoundingClientRect();
        const x = parseInt(textInput.style.left) - rect.left;
        const y = parseInt(textInput.style.top) - rect.top + fontSize; // Adjust for text height

        if (x < 0 || y < 0 || x > canvas.width || y > canvas.height || textInput.value.trim() === '') {
            textInput.style.display = 'none';
            textInput.value = '';
            return; // Exit if the text input is outside the canvas or empty
        }

        ctx.font = `${fontSize}px Arial`; // Use the same font size as the text input
        wrapText(ctx, textInput.value, x, y, canvas.width - x, fontSize + 4);

        textInput.style.display = 'none';
        textInput.value = '';
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function setDrawMode() {
    if (textInput.style.display === 'block') {
        placeText({ key: 'Enter' }); // Place any existing text
    }
    erasing = false;
    textMode = false;
    eraserSizeDisplay.style.display = 'none'; // Hide the eraser size display
}

function setEraseMode() {
    if (textInput.style.display === 'block') {
        placeText({ key: 'Enter' }); // Place any existing text
    }
    erasing = true;
    textMode = false;
    eraserSizeDisplay.style.display = 'block'; // Show the eraser size display
}

function setTextMode() {
    if (textInput.style.display === 'block') {
        placeText({ key: 'Enter' }); // Place any existing text
    }
    textMode = true;
    erasing = false;
    painting = false; // Stop any ongoing painting
    eraserSizeDisplay.style.display = 'none'; // Hide the eraser size display
}

function updateLineWidth() {
    lineWidth = sizeInput.value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateEraserSizeDisplay(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - lineWidth / 2;
    const y = e.clientY - rect.top - lineWidth / 2;

    eraserSizeDisplay.style.width = `${lineWidth}px`;
    eraserSizeDisplay.style.height = `${lineWidth}px`;
    eraserSizeDisplay.style.left = `${e.clientX - lineWidth / 2}px`;
    eraserSizeDisplay.style.top = `${e.clientY - lineWidth / 2}px`;
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
drawButton.addEventListener('click', setDrawMode);
eraseButton.addEventListener('click', setEraseMode);
textButton.addEventListener('click', setTextMode);
clearButton.addEventListener('click', clearCanvas);
sizeInput.addEventListener('input', updateLineWidth);
textInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        placeText(e);
    }
});

// Function to add a new chat message
function addChatMessage() {
    const username = usernameInput.value.trim();
    const message = chatInput.value.trim();
    if (message === '' || username === '') return;

    const chatItem = document.createElement('div');
    chatItem.className = 'chat-message';
    chatItem.innerHTML = `<strong>${username}:</strong> ${message}`;

    chatBox.appendChild(chatItem);
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Function to add a new to-do item
function addTodoItem() {
    const username = todoUsernameInput.value.trim();
    const status = todoStatus.value;
    if (username === '') return;

    // Ensure a student can mark attendance only once
    if (attendance.has(username)) {
        alert('This student has already marked attendance.');
        return;
    }
    attendance.add(username);

    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';

    const taskText = document.createElement('span');
    taskText.innerHTML = `<strong>${username}:</strong> ${status}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        todoItem.remove();
        attendance.delete(username); // Remove student from attendance set
    });

    todoItem.appendChild(taskText);
    todoItem.appendChild(deleteButton);
    todoList.appendChild(todoItem);

    todoStatus.value = 'present'; // Reset status to default
}

// Event listener for sending chat messages
sendChatButton.addEventListener('click', addChatMessage);
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addChatMessage();
    }
});

// Event listener for adding to-do items
addTodoButton.addEventListener('click', addTodoItem);
todoStatus.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addTodoItem();
    }
});
