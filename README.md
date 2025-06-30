# FreshFare2 - Grocery Store Management System

A full-stack web application for managing grocery store operations including inventory management, employee management, customer loyalty programs, and real-time chat support.

## 🚀 Features

- **Inventory Management**: Add, update, and track products
- **Employee Management**: Manage staff with different role levels (Owner, Manager, Cashier)
- **Customer Loyalty Program**: Track and reward loyal customers
- **Real-time Chat**: Customer support with live chat functionality
- **Payment Integration**: Stripe payment processing
- **Reporting**: Generate various reports for business insights
- **Authentication**: Secure JWT-based authentication
- **Email Services**: OTP verification and password reset

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Stripe** for payment processing
- **Nodemailer** for email services
- **bcrypt** for password hashing

### Frontend
- **React.js** (v19.0.0)
- **React Router** for navigation
- **Bootstrap** for UI components
- **Chart.js** for data visualization
- **Socket.IO Client** for real-time features
- **Axios** for API calls
- **React Hook Form** for form handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Stripe account for payment processing

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/FreshFare2.git
cd FreshFare2
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run Start
```
The backend server will run on `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
FreshFare2/
├── backend/
│   ├── Controllers/          # Request handlers
│   ├── Models/              # Database models
│   ├── Routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── services/            # Business logic
│   └── app.js               # Main server file
├── frontend/
│   ├── src/
│   │   ├── Components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── services/        # API services
│   │   └── styles/          # CSS files
│   └── public/              # Static assets
└── README.md
```

## 🔑 Environment Variables

Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 👥 User Roles

- **Owner**: Full access to all features
- **Manager**: Can manage employees and inventory
- **Cashier**: Can process transactions and view reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🔄 Version History

- v1.0.0 - Initial release with core functionality
