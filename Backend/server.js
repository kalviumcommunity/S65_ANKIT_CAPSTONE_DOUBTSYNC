// server.js

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const cors=require("cors")
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// Load environment variables
dotenv.config();
connectDB();

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", require("./Routes/userRoute"));
// app.use("/doubt", require("./Routes/doubtRoute")); 

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  },
});
app.set("io", io); 

// ✅ Option 2: Import first, call after
const socketHandler = require("./socket/socketHandler");
socketHandler(io);

app.get("/", (req, res) => {
  res.send("Root route");
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
