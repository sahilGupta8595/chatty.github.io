const socket = io();
console.log(socket);

socket.on("isloggedin", (msg) => {
  console.log(msg);
});

const btn = document.querySelector("#btn");
const msg = document.querySelector("#msg");
const msgList = document.querySelector(".msgList");
const chatbox = document.querySelector(".chatbox");

btn.addEventListener("click", (ev) => {
  socket.emit("sendmessage", {
    msg: msg.value,
    id: socket.id,
  });
});

socket.on("reply", (msg) => {
  console.log(msg);

  let div = document.createElement("div");
  div.innerText = `${msg.senderId} : ${msg.msg.msg}`;
  msgList.appendChild(div);
});