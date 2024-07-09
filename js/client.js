const socket=io('http://localhost:8000')


const form= document.getElementById('send-container');
const messageInput=document.getElementById('messageInp')
//container in which chats are populated
const messageContainer=document.querySelector(".msgContainer")
//container in which member names are populated
const messageContainer2=document.querySelector(".memberContainer")
var audio=new Audio('tone.mp3');


//function which populates the incoming chats
const append=(message,position,type)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add(type);
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    //if it is a received message or notification , then play sound
    if(position=='left' || position=='middle'){
        audio.play();
    }  
}




// to show all the present members in the chat room
// const showMember=(username)=>{
//     const messageElement=document.createElement('div');
//     messageElement.innerText=username;
//     messageElement.classList.add("member");
//     messageContainer2.append(messageElement); 
// }
//function which populates the outgoing chats
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    messageInput.value='';
    append(`you: ${message}`,'right',`message`)
    socket.emit('send', message)
})


//taking name of the user 
const username = prompt("Enter your name to join");
socket.emit('new-user-joined', username);

//for every user joined, display notification
const memberNames = new Set();
socket.on('user-joined', username=>{
    memberNames.add(username);
    append(`${username} joined the chat`,`middle`,`notification`);
    // showMember(username);
})

//show names of the members on the left container
socket.on('show-member', username=>{
    append(`You joined the chat`,`middle`,`notification`);
    // showMember(username);
})

//socket performing action on the recieved message
socket.on('receive', data=>{
    append(`${data.user} : ${data.message}`,`left`,`message`);
})

//socket performing action when somebody leaves the chatroom
socket.on('left', name=>{
    append(`${name} left the chat`,`middle`,`notification`);
})
