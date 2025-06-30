const socketIO = require('socket.io');
const socketController = require('../Controllers/socketController');

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join cashier room
    socket.on('join-cashier', (cashierId) => {
      socketController.handleCashierJoin(socket, cashierId);
    });

    // Handle customer number entry
    socket.on('customer-number', async ({ cashierId, mobileNumber }) => {
      console.log(`Received customer number ${mobileNumber} for cashier ${cashierId}`);
      await socketController.handleCustomerNumber(io, cashierId, mobileNumber);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = configureSocket; 