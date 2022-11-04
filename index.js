const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var data = {
    p1: 0,
    p2: 0,
    time: 10
}

io.on('connection', (socket) => {
    console.log('a user connected');

    io.emit('send game', data);

    socket.on('reset', () => {
        data = {
            p1: 0,
            p2: 0,
            time: 10,
            max: 1000
        }
    });

    socket.on('click', (playerId) => {
        console.log(`Click! [${playerId}]`);
        if (playerId === 'player1') {
            data.p1++;
        }
        if (playerId === 'player2') {
            data.p2++;
        }
        // This will emit the event to all connected sockets
        io.emit('update status', data);
    });

    socket.on('start game', () => {
        io.emit('start game');
    });

});

server.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
});