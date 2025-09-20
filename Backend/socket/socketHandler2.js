const userModel = require("../Models/userSchema");
const doubtModel=require("../Models/doubtSchema")
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("register_socket", async ({ userId }) => {
      await userModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
      });
    });

socket.on("join_room", ({ roomId }) => {
  try {
 
    socket.rooms.forEach(room => {  // leave previous room
      if (room !== socket.id) {
        socket.leave(room);
      }
    });



    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
    


    // Send join acknowledgment
    socket.emit("joined_room_ack", { roomId });
    
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("error", { message: "Failed to join room" });
  }
});









    socket.on("accept_doubt", async ({ doubtId, studentSocketId }) => {
      try {
        const doubt = await doubtModel.findById(doubtId);
        
        
        if (!doubt) {                                             // checking if doubt exist AND is not already assigned
          socket.emit("error", { message: "Doubt not found" }); 
          return;
        }

        if (doubt.isAssigned) {
          console.log(`Doubt ${doubtId} already taken`);
          socket.emit("doubt_already_taken", { doubtId });
          return;
        }

        console.log(`Teacher ${socket.id} accepting doubt ${doubtId}`);

        // Mark doubt as assigned immediately
        doubt.isAssigned = true;                               
        doubt.assignedTeacherId = socket.id;
        await doubt.save();

        
        io.to(studentSocketId).emit("doubt_accepted", {   //notifying student first 
          doubtId,
          teacherSocketId: socket.id 
        });

        
        socket.broadcast.emit("doubt_taken", { doubtId });   // then notifying other teachers

      } catch (error) {
        console.error("Error in accept_doubt:", error);
        socket.emit("error", { message: "Failed to accept doubt" });
      }
    });







    socket.on("send_message", ({ roomId, sender, message }) => {
      io.to(roomId).emit("receive_message", { sender, message });
    });

  
    socket.on("offer", ({ offer, roomId }) => {              //WebRTC Signaling
      console.log(" Forwarding offer to room:", roomId);
      socket.to(roomId).emit("offer", { offer, roomId });
    });

    socket.on("answer", ({ answer, roomId }) => {
      console.log(" Forwarding answer to room:", roomId);
      socket.to(roomId).emit("answer", { answer, roomId });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
      console.log(" Forwarding ICE candidate to room:", roomId);
      socket.to(roomId).emit("ice-candidate", { candidate, roomId });
    });




socket.on("leave_room", ({ roomId }) => {
  socket.leave(roomId);
  socket.to(roomId).emit("user_left");  // Inform the other peer

  console.log(` ${socket.id} left room: ${roomId}`);

});





    socket.on("disconnect", async () => {
      console.log(" Disconnected:", socket.id);
      await userModel.findOneAndUpdate(
        { socketId: socket.id },
        {
          isOnline: false,
          isAvailable: false,
          $unset: { socketId: "" },
        }
      );
    });
  });
};

module.exports = socketHandler;
