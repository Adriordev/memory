import { io } from "socket.io-client";

const URL = "http://localhost:3000/game";

export const socket =(id)=>{
  console.log(id);
  const gameSocket = io(URL+id, { autoConnect: false });
  gameSocket.onAny((event, ...args) => {
    console.log(event, args);
  });
  return gameSocket
} 



