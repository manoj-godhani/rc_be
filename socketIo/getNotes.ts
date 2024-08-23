import { Server as SocketIOServer, Socket } from 'socket.io';
import supabase from "../services/db/supabase";

export const updateNotes = async (io: SocketIOServer, client: Socket, { room,notes ,shareLink}: { room: string,notes:any,shareLink:boolean }) => {
   const now = new Date();
   const timestamp = now.toISOString();
   try {
      const { data, error } = await supabase.getClient()
      .from('filedocs')
      .update({ note: notes ,last_update:timestamp})
      .eq('id', room).select();

      if (data) {
         if(shareLink){
            io.to(room).emit('receive_message', data[0].note);
         }else{
            client.emit("receive_message", data[0].note);
         }
      } else {
         console.log("error", error)
      }
   } catch (error) {
      console.error('Error fetching notes:', error);
   }
};

export const joinRoom = async (io: SocketIOServer, client: Socket, { room }: { room: string }) => {
   try {
      client.join(room);
      console.log(`User with ID: ${client.id} joined room: ${room}`);
   } catch (error) {
      console.error('Error fetching notes:', error);
   }
};