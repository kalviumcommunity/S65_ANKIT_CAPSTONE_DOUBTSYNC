const userModel = require("../Models/userSchema");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);



    socket.on("register_socket", async ({ userId }) => {
      await userModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,  // ✅ Set isOnline true on connection
      });
    });

    socket.on("join_room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`🟢 ${socket.id} joined room: ${roomId}`);
    });

    socket.on("accept_doubt", ({ doubtId, studentSocketId }) => {
      io.to(studentSocketId).emit("doubt_accepted", { doubtId });
    });

 

       socket.on("send_message", ({ roomId, sender, message }) => {
      io.to(roomId).emit("receive_message", { sender, message });
    });








socket.on("disconnect", async () => {
  console.log("🔴 Disconnected:", socket.id);

  // ✅ Update both isOnline and isAvailable to false on disconnect
  await userModel.findOneAndUpdate(
    { socketId: socket.id },
    {
      isOnline: false,
      isAvailable: false,
      $unset: { socketId: "" },
    }
  );
});
  })}

module.exports = socketHandler;
