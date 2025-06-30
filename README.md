# FRESHFARE - Point of Sale System

A comprehensive web-based Point of Sale (POS) system designed to optimize and automate core retail operations for supermarkets and grocery stores. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to provide a scalable, user-friendly solution for modern businesses.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue.svg)

## 🏪 Project Overview

FreshFare is an all-in-one POS solution that transforms manual retail operations into an efficient, automated system. The system addresses common retail challenges including long checkout times, inventory management issues, employee tracking difficulties, and manual data entry errors.

**Project ID:** ITP25_B2_C1-40  
**Institution:** Sri Lanka Institute of Information Technology (SLIIT)  
**Course:** Information Technology Project (IT2080)

## 👥 Development Team

| Name | Registration Number | Email | Role |
|------|-------------------|-------|------|
| **P.A.H.I Gunasekara** | IT23232136 | IT23232136@my.sliit.lk | **Project Lead** |
| K.S.H Liyanage | IT23382558 | IT23382558@my.sliit.lk | Full Stack Developer |
| V.S Hettiarachchi | IT23382176 | IT23382176@my.sliit.lk | Backend Developer |
| R.R.D Pinto | IT23319806 | IT23319806@my.sliit.lk | Frontend Developer |
| W.M.K Gayantha | IT23317826 | IT23317826@my.sliit.lk | System Analyst |

## 🚀 Key Features

### 🛒 Billing & Transaction Management
- **Barcode Scanning**: Quick product identification and details retrieval
- **Multiple Payment Methods**: Support for cash, credit/debit cards, and digital wallets
- **Digital Receipts**: Automated email receipt generation
- **Real-time Processing**: Instant transaction recording and inventory updates
- **Discount Management**: Automated promotion and loyalty discount application

### 📦 Inventory Management
- **Real-time Stock Tracking**: Live inventory updates with each transaction
- **Low Stock Alerts**: Automated notifications when items fall below threshold
- **Product Management**: Complete CRUD operations for product information
- **Visual Analytics**: Stock level charts and category distribution graphs
- **Batch Operations**: Bulk inventory updates and management

### 👥 Employee Management
- **Role-based Access Control**: Three-tier access (Owner, Manager, Cashier)
- **Attendance Tracking**: Automated work hour monitoring via login/logout
- **Performance Analytics**: Sales performance and productivity reports
- **Employee Profiles**: Comprehensive staff information management
- **Activity Monitoring**: Real-time employee activity tracking

### 🤝 Customer & Loyalty Management
- **Loyalty Points System**: Reward customers based on purchase amounts
- **OTP Verification**: Secure customer registration via LocalText API
- **Email Integration**: Receipt delivery and promotional campaigns via Brevo API
- **Customer Analytics**: Purchase history and preference tracking
- **Point Redemption**: Flexible discount system based on accumulated points

### 🏢 Supplier Management
- **Supplier Database**: Comprehensive supplier information management
- **Order Tracking**: Real-time delivery and stock order monitoring
- **Payment Status**: Visual representation of paid/unpaid suppliers
- **Performance Reports**: Supplier reliability and delivery analytics
- **Communication Tools**: Streamlined supplier-business communication

### 📊 Dashboard & Analytics
- **Owner Dashboard**: Complete business overview with profit charts and analytics
- **Cashier Dashboard**: Transaction-focused interface for daily operations
- **Visual Data Representation**: Interactive charts using Chart.js
- **Real-time Updates**: Live data synchronization across all modules
- **Custom Reports**: Automated daily, weekly, and monthly business reports

### 🤖 AI Integration
- **Smart Chatbot**: LLM-powered assistant for database queries and system help
- **Data Insights**: AI-driven business intelligence and recommendations
- **Automated Responses**: Quick answers to common operational questions

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment for server-side JavaScript
- **Express.js**: Web application framework for API development
- **MongoDB**: NoSQL database for flexible, scalable data storage
- **JWT**: Secure authentication and session management
- **Stripe API**: Payment processing integration
- **Brevo API**: Email service for receipts and marketing
- **LocalText API**: OTP services for Sri Lankan mobile numbers

### Frontend
- **React.js (v19.0.0)**: Modern UI library for interactive interfaces
- **CSS Frameworks**: Responsive design with modern styling
- **Chart.js**: Advanced data visualization and analytics
- **React Router**: Single-page application navigation
- **Axios**: HTTP client for API communication

### Development Tools
- **Git & GitHub**: Version control and collaboration
- **JIRA**: Agile project management and issue tracking
- **Postman**: API development and testing
- **Calendly**: Team meeting and time management

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Stripe Account** for payment processing
- **Email Service** for receipt delivery

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/HeshanInduranga/FRESHFARE-POS.git
cd FRESHFARE-POS
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/freshfare
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freshfare

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRE=24h

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Services
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@freshfare.com

# SMS/OTP Services
LOCALTEXT_API_KEY=your_localtext_api_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Database Setup
```bash
# If using local MongoDB, start the service
mongod

# Create initial admin user (run once)
npm run seed:admin
```

## 🚀 Running the Application

### Development Mode

**Start Backend Server:**
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000`

**Start Frontend Server:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Production Server:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
FRESHFARE-POS/
├── backend/
│   ├── controllers/         # Request handlers and business logic
│   │   ├── authController.js
│   │   ├── inventoryController.js
│   │   ├── employeeController.js
│   │   └── customerController.js
│   ├── models/             # MongoDB schemas and models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Transaction.js
│   │   └── Customer.js
│   ├── routes/             # API route definitions
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── billing.js
│   │   └── reports.js
│   ├── middleware/         # Custom middleware functions
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── config/             # Configuration files
│   │   ├── database.js
│   │   └── stripe.js
│   ├── utils/              # Utility functions
│   ├── services/           # External service integrations
│   └── app.js              # Main server application
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── forms/
│   │   ├── pages/          # Main page components
│   │   │   ├── Dashboard/
│   │   │   ├── Inventory/
│   │   │   ├── Billing/
│   │   │   └── Reports/
│   │   ├── services/       # API service calls
│   │   ├── utils/          # Helper functions
│   │   ├── styles/         # CSS and styling files
│   │   └── App.js          # Main application component
│   ├── public/             # Static assets
│   └── package.json
├── docs/                   # Documentation and diagrams
├── tests/                  # Test files and test cases
└── README.md
```

## 👤 User Roles & Permissions

### 🔹 Owner (Full Access)
- Complete system access and control
- Financial reports and profit analysis
- Employee management and role assignment
- System configuration and settings
- All dashboard features and analytics

### 🔹 Manager (Administrative Access)
- Inventory management and stock control
- Employee supervision and performance tracking
- Supplier management and procurement
- Sales reports and operational analytics
- Customer and loyalty program management

### 🔹 Cashier (Operational Access)
- Transaction processing and billing
- Customer service and support
- Basic inventory viewing
- Daily sales reports
- Customer loyalty point management

## 🧪 Testing

The system includes comprehensive testing covering:

### Test Coverage
- **Unit Tests**: Individual component functionality
- **Integration Tests**: API endpoint testing
- **UI Tests**: User interface and experience validation
- **Security Tests**: Authentication and data protection
- **Performance Tests**: System load and response time testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests with coverage
npm run test:coverage
```

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/forgot-password # Password reset
GET  /api/auth/verify-token   # Token validation
```

### Inventory Management
```
GET    /api/inventory         # Get all products
POST   /api/inventory         # Add new product
PUT    /api/inventory/:id     # Update product
DELETE /api/inventory/:id     # Delete product
GET    /api/inventory/low-stock # Get low stock items
```

### Billing & Transactions
```
POST /api/billing/process     # Process transaction
GET  /api/billing/history     # Transaction history
POST /api/billing/refund      # Process refund
GET  /api/billing/reports     # Sales reports
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permission management
- **Data Encryption**: Sensitive data protection
- **Input Validation**: XSS and injection attack prevention
- **Secure Payment Processing**: PCI DSS compliant via Stripe
- **Session Management**: Secure session handling and timeout

## 📈 Performance Optimization

- **Database Indexing**: Optimized MongoDB queries
- **Caching Strategy**: Redis caching for frequently accessed data
- **Code Splitting**: Lazy loading for improved frontend performance
- **Image Optimization**: Compressed and optimized product images
- **API Rate Limiting**: Protection against abuse and overload

## 🌐 Deployment

### Production Deployment Options

**1. Traditional VPS/Cloud Server:**
```bash
# Build the application
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start app.js --name "freshfare-backend"
```

**2. Docker Deployment:**
```bash
# Build Docker images
docker-compose build

# Run containers
docker-compose up -d
```

**3. Cloud Platform Deployment:**
- **Heroku**: Direct Git deployment
- **Vercel**: Frontend deployment
- **Railway**: Full-stack deployment
- **AWS EC2**: Complete server deployment

## 🤝 Contributing

We welcome contributions to improve FreshFare! Here's how you can help:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation when necessary
- Ensure all tests pass before submitting PR

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features:

- **Bug Reports**: Include steps to reproduce, expected behavior, and screenshots
- **Feature Requests**: Describe the feature and its potential benefits
- **Documentation Issues**: Help us improve our documentation

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ms. Geethanjali Wimalaratne** - Project Supervisor and Lecturer
- **Sri Lanka Institute of Information Technology (SLIIT)** - Academic support and resources
- **Development Team** - For their dedication and collaborative effort
- **Open Source Community** - For the amazing tools and libraries used

## 📞 Support & Contact

For support, questions, or suggestions:

- **Email**: IT23232136@my.sliit.lk (Heshan Induranga Gunasekara - Project Lead)
- **GitHub Issues**: [Create an issue](https://github.com/HeshanInduranga/FRESHFARE-POS/issues)
- **Project Repository**: [FRESHFARE-POS](https://github.com/HeshanInduranga/FRESHFARE-POS)

## 🔄 Version History

- **v1.0.0** (May 2025) - Initial release with core POS functionality
  - Complete billing and transaction system
  - Inventory management with real-time updates
  - Employee and customer management
  - Supplier management and analytics
  - AI chatbot integration
  - Multi-role dashboard system

---

⭐ **Star this repository if you find it helpful!**

**Built with ❤️ by Team ITP25_B2_C1-40**
