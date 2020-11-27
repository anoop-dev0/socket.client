// Make connection
const ec2_URL = "http://3.212.251.206:4000";
//const ec2_URL = "http://localhost:4000";
let showChat = true;
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
    btnGenGro = document.getElementById("addToGroup"),
    isGroup = document.getElementById("sendToGroup"),
    buzzIdStr = document.getElementById("buzzList"),
recipient = document.getElementById('recipient');

// Emit events
btnGenGro.addEventListener('click',function(){
    if(buzzIdStr.value){
        let buzzList = buzzIdStr.value.split(",");
        socket.emit('create-group',{handle:handle.value,buzzList});
    }
})
btn.addEventListener('click', function () {
    console.log(isGroup.checked);
    // if(recipient.value.startsWith("G") || recipient.value.startsWith("g")){
    //     socket.emit('send-group', {
    //         message: message.value,
    //         handle: handle.value,
    //         roomId : recipient.value
    //     });
    // }
    // else
     if (recipient.value) {
         if(isGroup.checked)
         {
            socket.emit('send-group', {
                message: message.value,
                handle: handle.value,
                recipient:recipient.value
            });
        }
        else{
            socket.emit('chat-private', {
                message: message.value,
                handle: handle.value,
                recipient:recipient.value
            });
        }
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
socket.on('recieve-msg', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.sentBy + '</strong> ('+data.roomId+') : ' + data.message + '</p>';
});
socket.on('added-group',function (data) {
    output.innerHTML += '<p>You have been added to group <strong> ' + data.roomId + ' </strong> by user <strong>' + data.addedBy + '</p>';
})

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
