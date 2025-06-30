import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
    this.connectionPromise = null;
  }

  async ensureConnected() {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.isConnecting = false;
        resolve(this.socket);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnecting = false;
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.isConnecting = false;
        reject(error);
      });
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  async joinCashierRoom(cashierId) {
    try {
      const socket = await this.ensureConnected();
      console.log('Joining cashier room:', `cashier-${cashierId}`);
      socket.emit('join-cashier', cashierId);
    } catch (error) {
      console.error('Error joining cashier room:', error);
    }
  }

  async emitCustomerNumber(cashierId, mobileNumber) {
    try {
      const socket = await this.ensureConnected();
      console.log('Emitting customer number to room:', `cashier-${cashierId}`, 'Number:', mobileNumber);
      socket.emit('customer-number', { cashierId, mobileNumber });
    } catch (error) {
      console.error('Error emitting customer number:', error);
    }
  }

  async onCustomerDetails(callback) {
    try {
      const socket = await this.ensureConnected();
      console.log('Setting up customer details listener');
      socket.on('customer-details', (data) => {
        console.log('Received customer details:', data);
        callback(data);
      });
    } catch (error) {
      console.error('Error setting up customer details listener:', error);
    }
  }

  async offCustomerDetails(callback) {
    try {
      const socket = await this.ensureConnected();
      socket.off('customer-details', callback);
    } catch (error) {
      console.error('Error removing customer details listener:', error);
    }
  }
}

export const socketService = new SocketService(); 