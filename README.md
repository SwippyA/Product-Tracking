# Product-Tracking
# Product Tracker API

## Setup Instructions

1. Clone the repository:

```sh
git clone https://github.com/SwippyA/Product-Tracking.git
cd product-tracker
npm install

Based on the requirements from the uploaded document, we'll develop a complete API to track the status and location of products. This will include user authentication, role-based access control, product management, tracking status updates, and an email notification system.

Step-by-Step Implementation
Step 1: Set Up the Project
Initialize the project:
sh
Copy code
mkdir product-tracker
cd product-tracker
npm init -y
Install necessary dependencies:
sh
Copy code
npm install express mongoose body-parser bcryptjs jsonwebtoken nodemailer
Step 2: Create the Basic Server
Create server.js:
javascript
Copy code
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const trackingsRouter = require('./routes/trackings');
const usersRouter = require('./routes/users');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/productTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Use routes
app.use('/api/products', productsRouter);
app.use('/api/trackings', trackingsRouter);
app.use('/api/users', usersRouter);

// Define the port
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
Step 3: Define the Models
Create models/User.js:
javascript
Copy code
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'customer'] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
Create models/Product.js:
javascript
Copy code
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    trackingNumber: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
Create models/Tracking.js:
javascript
Copy code
const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Tracking', trackingSchema);
Step 4: Create Middleware for Authentication and Authorization
Create middleware/auth.js:
javascript
Copy code
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
Step 5: Create Routes for Users (Registration and Login)
Create routes/users.js:
javascript
Copy code
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({ username, password: hashedPassword, role });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
Step 6: Create Routes for Product Management
Create routes/products.js:
javascript
Copy code
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all products
router.get('/', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a product by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
router.post('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    const { name, status, location } = req.body;
    const trackingNumber = generateTrackingNumber();

    const product = new Product({
        name,
        status,
        location,
        trackingNumber,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product by ID
router.put('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, status, location } = req.body;
        if (name) product.name = name;
        if (status) product.status = status;
        if (location) product.location = location;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product by ID
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.remove();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Generate a unique tracking number
function generateTrackingNumber() {
    return 'TN' + Math.floor(Math.random() * 1000000);
}

module.exports = router;
Step 7: Create Routes for Tracking Status Updates
Create routes/trackings.js:
javascript
Copy code
const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const Product = require('../models/Product');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Get tracking history for a product
router.get('/:productId', authenticateToken, async (req, res) => {
    try {
        const trackings = await Tracking.find({ productId: req.params.productId });
        res.json(trackings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a tracking entry for a product
router.post('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    const { productId, status, location } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.status = status;
        product.location = location;
        await product.save();

        const tracking = new Tracking({
            productId,
            status,
            location,
        });

        const newTracking = await tracking.save();

        sendEmailNotification(productId, status, location);

        res.status(201).json(newTracking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Email notification function
async function sendEmailNotification(productId, status, location) {
    const product = await Product.findById(productId).populate('User');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword',
        },
    });

    const mailOptions = {
        from: 'youremail@gmail.com',
        to: 'customer@example.com', // Replace with actual customer's email
        subject: 'Product Status Update',
        text: `Your product with tracking number ${product.trackingNumber} is now ${status} at ${location}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
Step 8: Document API Endpoints with Postman
Document each endpoint in Postman:
Add detailed descriptions for each endpoint.
Provide request/response examples.
Include error handling cases.
Step 9: Prepare for Deployment
Create a README.md file:
markdown
Copy code
# Product Tracker API

## Setup Instructions

1. Clone the repository:

```sh
git clone <repository-url>
cd product-tracker
Install dependencies:
sh
Copy code
npm install
Configure environment variables (e.g., MongoDB URI, JWT secret, email credentials).

Start the server:

sh
Copy code
node server.js
API Endpoints Documentation
[Postman Documentation Link]

Features
User Authentication and Authorization
Product Management
Tracking Status Updates
Email Notifications
Technologies Used
Node.js
Express
MongoDB
JWT for authentication
Nodemailer for email notifications