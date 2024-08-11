// sockets/timeSocket.js
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        let intervalId = setInterval(() => {
            socket.emit('currentTime', { currentTime: new Date().toISOString() });
        }, 10000);
    

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
            clearInterval(intervalId);
        });
    });
    
};
