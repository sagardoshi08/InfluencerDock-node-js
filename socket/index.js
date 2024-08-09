async function socketOperations (socketIO) {
  try {
    socketIO.on('connection', (socket) => {
      console.log(`${socket.id} user just connected!`);

      socket.on('send-message', (data) => {
        console.log('data', data);
        socket.broadcast.emit(`chat-count-${data}`, '5');
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

async function socketData (socket) {
  await socketOperations(socket);
}
module.exports = socketData;
