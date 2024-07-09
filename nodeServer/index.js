//This is a node server for the convo chat 


//CORS ARE INTRODUCED IN THE NEW VERSIONS OF SOCKET.IO AND ARE TO BE SET TO ESTABLISH A CONNECTION WITH SOCKET CLIENTS
const io= require("socket.io")(8000, {
    cors: {
        origin: '*',
      }
});


//array of users
const users = {};




io.on('connection',socket =>{

    //when new user joins the chat, this event is triggered
    socket.on('new-user-joined',username =>{
        users[socket.id]=username;
        socket.broadcast.emit('user-joined', username);//broadcast.emit sends information to all client except itself
        socket.emit('show-member', username);//.emit sends the information to itself
    });

    //whenever someone sends message, this event is triggered
    socket.on('send',message =>{
        //this socket signal is then recieved in client.js and the incoming chats are populated in chat Area
        socket.broadcast.emit('receive', {message: message,user: users[socket.id]})
    });

    //whenever someone leaves the chat, this event is triggered
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left', users[socket.id])
            delete users[socket.id];
    });
})


