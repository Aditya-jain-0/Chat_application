const socket = io();
var username;
var chats = document.querySelector(".chats")
var users_count=document.querySelector(".users-count")
var users_list = document.querySelector(".users-list")
var msg_send = document.querySelector('#user_send');
var user_msg = document.querySelector('#user_msg')
const now = new Date();

do{
    username = prompt("Enter Your name");
}while(!username)

//new user joined
socket.emit("new-user-joined",username);

//user-joined message
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined')
})

//user left/join
function userJoinLeft(name,status){
    let div = document.createElement("div");
    div.classList.add("user-join")
    let content = `<p><b>${name}</b> ${status} the chat</p> at ${now.getHours()}:${now.getMinutes()}`;
    div.innerHTML=content;
    chats.append(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left')
})

//user list and count
socket.on('user-list',(users)=>{
    users_list.innerHTML = "";
    users_arr = Object.values(users)
    for(let i=0;i<users_arr.length;++i){
        let p = document.createElement('p');
        p.innerText= users_arr[i];
        users_list.append(p);
    }
    users_count.innerHTML=users_arr.length;
})

msg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg:user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
})

function appendMessage(data,status){
    let div = document.createElement('div');
    div.classList.add('message',status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming')
})