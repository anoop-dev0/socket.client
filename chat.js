
//const ec2_URL = "http://3.139.194.131:4000/";
const ec2_URL = "http://localhost:4000";
let showChat = true;

function getBuzzId() {
    let person = prompt("Please enter your name", "Harry Potter");
    if (person != null) {
        return person
    }
    else
        return getBuzzId()
}
var socket = io.connect(ec2_URL, {
    query: { buzzId: getBuzzId().toLowerCase() }
});

// Query DOM
var message = document.getElementById('message'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    btnGenGro = document.getElementById("addToGroup"),
    isGroup = document.getElementById("sendToGroup"),
    buzzIdStr = document.getElementById("buzzList"),
    groupNameHandler = document.getElementById("groupName"),
    recipient = document.getElementById('recipient');

// Emit events
message.addEventListener('keypress', function(){
    socket.emit('typing', { recipient: recipient.value.toLowerCase() });
})
btnGenGro.addEventListener('click', function () {
    if (buzzIdStr.value) {
        let buzzList = buzzIdStr.value.split(",");
        socket.emit('create-group', { groupName: groupNameHandler.value, buzzList });
    }
})
btn.addEventListener('click', function () {
    if (recipient.value) {
        if (!isGroup.checked) {
            socket.emit('chat-private', {
                message: message.value,
                recieverId: recipient.value.toLowerCase(),
                isGroupMessage: isGroup.checked
            });
        }
        else {
            socket.emit('chat-group', {
                message: message.value,
                groupId: recipient.value.toLowerCase(),
            });
        }
    }

    message.value = "";
});

// message.addEventListener('keypress', function () {
//     if (recipient.value) {
//         socket.emit('typing-private', handle.value);
//     }
//     else {
//         socket.emit('typing-public', handle.value);
//     }
// })

// Listen for events
socket.on('chat', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.senderName + ': </strong>' + data.message + '</p>';
});
socket.on('chat-group', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.senderName + ' ('+ data.groupName +') : </strong>' + data.message + '</p>';
});
socket.on('recieve-msg', function (data) {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.sentBy + '</strong> ( ' + data.roomId + ' ) : ' + data.message + '</p>';
});
socket.on('added-group', function (data) {
    output.innerHTML += '<p>You have been added to group <strong> ' + data.groupName + '('+ data.groupId +') </strong> by <strong>' + data.addedBy + '</p>';
})
socket.on('group-created', function (data) {
    if(data.success)
        output.innerHTML += '<p><strong> ' + data.groupName + ' </strong> created by you with id <strong>' + data.groupId + '</p>';
    else
        alert("Group could not be created")
})
socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data.typerName + ' is typing a message...</em></p>';
});
socket.on('online', function (data) {
    alert(`${data.senderName} is online now`);
});
socket.on('offline', function (data) {
    alert(`${data.senderName} is offline now`);
});
socket.on('unauthorized', function(data){
    alert(data);
})
socket.on('error', function(data){
    alert(data);
})
