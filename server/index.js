const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./route/authRouter");
const chatRouter = require("./route/chatRouter");
const messageRouter = require("./route/messageRouter");
const aiRouter = require("./route/aiRouter");
const scamRouter = require("./route/scamRouter");
require("./job/cron");

const frontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const mongoUri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_HOSTED
    : process.env.MONGODB_URI_LOCAL;

const app = express();
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/images", express.static("images"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hiee ;)" });
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);
app.use("/api/admin", require("./route/adminRouter"));
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/ai", aiRouter);
app.use("/api/scams", scamRouter);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Datebase connected.");

    const server = app.listen(PORT, () => {
      console.log(
        `Server running on  http://localhost:${PORT} and serving to ${frontend}`
      );
    });

    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: frontend,
      },
    });

    io.on("connection", (socket) => {
      console.log("Connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });

      socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        if(userData) socket.leave(userData._id);
      });
    });
  })
  .catch((err) => {
    console.error("Database connection error: ", err);
  });