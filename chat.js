// Make connection
const ec2_URL = "http://3.212.251.206:4000";
function getBuzzId() {
    small = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    capital = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    buzzId = Math.ceil(Math.random() * 10000) + small[Math.floor(Math.random()*25)] + capital[Math.floor(Math.random()*25)];
    alert(`Your Buzz-Id is ${buzzId}`);
    console.log(`Your Buzz-Id is ${buzzId}`);
    
    return buzzId;
}
var socket = io.connect(ec2_URL, {
    query: { buzzId: getBuzzId() }
});

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
recipient = document.getElementById('recipient');

// Emit events
btn.addEventListener('click', function () {
    if (recipient.value) {
        socket.emit('chat-private', {
            message: message.value,
            handle: handle.value,
            recipient:recipient.value
        });
    }
    else{
        socket.emit('chat-public', {
            message: message.value,
            handle: handle.value,
            recipient:null
        });
    }
    message.value = "";
    handle.disabled = true;
});

message.addEventListener('keypress', function () {
    if (recipient.value) {
        socket.emit('typing-private', handle.value);
    }
    else{
        socket.emit('typing-public', handle.value);
    }
})

// Listen for events
socket.on('chat', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
