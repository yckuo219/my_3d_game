// server.js

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const firebaseAdmin = require('firebase-admin');

// 初始化 Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://chattest-ae184-default-rtdb.firebaseio.com'
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    // 处理用户消息
    socket.on('message', (data) => {
        io.emit('message', data);
    });

    // 处理用户断开连接
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
