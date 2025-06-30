const LC = require('../Models/LC_Model');

const socketService = {
  // Emit customer details to specific cashier
  emitCustomerDetails: async (io, cashierId, mobileNumber) => {
    try {
      const customer = await LC.findOne({ mobile: mobileNumber });
      if (customer) {
        io.to(`cashier-${cashierId}`).emit('customer-details', {
          success: true,
          customer: {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            totalPoints: customer.totalPoints,
            totalSpent: customer.totalSpent,
            registeredDate: customer.registeredDate,
            lastTransactionDate: customer.lastTransactionDate,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        io.to(`cashier-${cashierId}`).emit('customer-details', {
          success: false,
          message: 'Customer not found in the loyal customers database',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error emitting customer details:', error);
      io.to(`cashier-${cashierId}`).emit('customer-details', {
        success: false,
        message: 'Error fetching customer details from database',
        timestamp: new Date().toISOString()
      });
    }
  }
};

module.exports = socketService; 