const express = require('express')
const app = express()
const PORT = 5000

const http = require('http').Server(app)
const cors = require('cors')
const socketIO = require('socket.io')(http, {
    cors:{
        origin: 'http://localhost:5173'
    }
})

app.get('api', (req, res) => {
    res.json({
        message: 'Hello'
    })
})

const users = []

socketIO.on('connection', (socket) => {
    console.log(socket.id + ' user connected')
    socket.on('message', (data) => {
        socketIO.emit('response', data)
    })
    socket.on('newUser', (data) => {
        users.push(data)
        socketIO.emit('responseNewUser', users)
    })

    socket.on('typing', (data) => socket.broadcast.emit('responseTyping', data))

    socket.on('createRoom', (roomName) => {
        // Создаем объект комнаты
        const newRoom = {
          name: roomName,
          members: [],
          creator: socket.id, // Пока используем socket.id как идентификатор создателя
          messages: [],
        };
        // Отправляем созданную комнату обратно клиенту
        socketIO.emit('roomCreated', newRoom);
      });

      socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
    });

    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect')
    })
})

http.listen(PORT, () => {
    console.log('Server working')
})