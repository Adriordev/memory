import { io } from "socket.io-client";
import {serverUrl} from './constants'

const URL = serverUrl+"/game/";
console.log(URL);
export const socket =(id)=>{
  console.log(id);
  const gameSocket = io(URL+id, { autoConnect: false });
  gameSocket.onAny((event, ...args) => {
    console.log(event, args);
  });
  return gameSocket
} 



