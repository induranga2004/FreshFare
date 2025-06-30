const express = require('express');
const mongoose = require('mongoose');
const inventoryRouter = require("./Routes/inventoryRoutes.js");
const employeeRouter = require("./routers/employees.js");
const striperoute = require("./routers/Stripe.js")
const router = require('./Routes/LC_Route.js')
const chatRouter = require('./Routes/chatRoute.js')
const admin = require("../backend/scripts/admin.js")
const productroute = require("./routers/Productroute.js")
const authRouter  = require("./Routes/authRoutes.js")
const transactionroute = require("./routers/transactionroute.js")
const resetpassword = require("./routers/email.js")
const configureSocket = require('./configuration/socketConfig');
const supplierRoutes = require("./Routes/suppliers.js")
const app = express();
const cors = require("cors")

//Middleware
app.use(express.json())
// CORS middleware setup
app.use(cors({
  origin: 'http://localhost:3000',  // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed methods
  allowedHeaders: 'Content-Type,Authorization'  // Allowed headers
}));
admin.createAdmin()
app.use((req,res,next) =>{
  console.log(req.path, req.method);
  next();
})
app.use('/api/suppliers', supplierRoutes);
app.use("/Employee", employeeRouter);
app.use('/api/products',inventoryRouter);
//Routes
app.use("/password",resetpassword);
app.use("/LCs", router);
app.use("/chat",chatRouter);
app.use('/product',productroute);
app.use('/stripes',striperoute);
app.use('/transaction',transactionroute);
app.use('/api/auth', authRouter);
mongoose.connect('mongodb+srv://Kaviya:kavindu@cluster0.vlphs.mongodb.net/FRESHFARE')
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(5000, () => {
      console.log('Server running on port 5000');
    });

    // Initialize Socket.IO
    const io = configureSocket(server);
    app.set('io', io);
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));