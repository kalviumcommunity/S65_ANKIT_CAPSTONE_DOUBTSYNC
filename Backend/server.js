
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


dotenv.config();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}));


app.use(cookieParser());
app.use(express.json());


app.use("/", require("./Routes/userRoute"));


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
app.set("io", io);
const socketHandler = require("./socket/socketHandler");
socketHandler(io);


app.get("/", (req, res) => {
  res.send("Root route");
});


server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
