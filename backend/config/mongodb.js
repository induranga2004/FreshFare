// config/mongodb.js
import mongoose from 'mongoose';

const connectdb = async () => {
    try {
        await mongoose.connect(`${process.env.URI}/TEST2`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection.on('connected', () => console.log('Database Connected'));
        mongoose.connection.on('error', (err) => console.log('MongoDB connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
    } catch (err) {
        throw err;
    }
};

export default connectdb;
