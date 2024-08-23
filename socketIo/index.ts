import { Server as SocketIOServer } from 'socket.io';
import {updateNotes,joinRoom} from "./getNotes"

export const socketUse = (io: SocketIOServer) => {
  io.on("connection", (client) => {
    console.log("A user connected");

    client.on("send_message", (data) => {
      io.emit("receive_message", data);
    });
    
    client.on("send_update_notes", (data) => {
      const {room,notes,shareLink}=JSON.parse(data)
      updateNotes(io,client,{room,notes,shareLink})
    });

    client.on("joinRoom", room => {
      joinRoom(io,client,{room})
    })
    
    client.on("leaveRoom", (room) => {
      client.leave(room);
      console.log(`A user left room: ${room}`);
    });

    client.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
