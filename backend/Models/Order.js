const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cashierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card']
    },
    status: {
        type: String,
        required: true,
        default: 'completed',
        enum: ['completed', 'cancelled', 'pending']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema); 