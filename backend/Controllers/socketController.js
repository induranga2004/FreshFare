const socketService = require('../services/socketService');

const socketController = {
  // Handle customer number entry
  handleCustomerNumber: async (io, cashierId, mobileNumber) => {
    await socketService.emitCustomerDetails(io, cashierId, mobileNumber);
  },

  // Handle cashier joining
  handleCashierJoin: (socket, cashierId) => {
    socket.join(`cashier-${cashierId}`);
    console.log(`Cashier ${cashierId} joined their room`);
  }
};

module.exports = socketController; 