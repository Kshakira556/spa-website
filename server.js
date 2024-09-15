const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Configure session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB file size limit
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(uploadDir));

// Mock user data
const users = {
    'admin': { password: 'adminpass', role: 'admin' },
    'customer1': { password: 'customerpass', role: 'customer' }
};

// Handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (user && user.password === password) {
        req.session.user = { username, role: user.role };
        res.json({ success: true, role: user.role });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Handle user logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Middleware to check if user is logged in
const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Serve static files for user profiles and dashboards if needed

// Handle product upload
app.post('/api/upload_product', upload.single('product-image'), (req, res) => {
    const { 'product-name': name, 'product-price': price } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('Product Name:', name);
    console.log('Price:', price);
    console.log('Image Path:', image.path);

    res.json({ success: true, fileName: path.basename(image.path) });
});

// Handle bookings data
app.get('/api/bookings', checkAuth, (req, res) => {
    res.json(bookings);
});

// Handle booking status update (accept or decline)
app.post('/api/bookings/:id/status', checkAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'
    const booking = bookings.find(b => b.id === id);

    if (booking) {
        booking.status = status;
        res.json({ success: true, booking });
    } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
    }
});

// Handle booking details update
app.post('/api/bookings/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { date, clientName, service } = req.body;
    const booking = bookings.find(b => b.id === id);

    if (booking) {
        booking.date = date || booking.date;
        booking.clientName = clientName || booking.clientName;
        booking.service = service || booking.service;
        res.json({ success: true, booking });
    } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
    }
});

// Handle date cancellation
app.post('/api/bookings/:id/cancel', checkAuth, (req, res) => {
    const { id } = req.params;
    const bookingIndex = bookings.findIndex(b => b.id === id);

    if (bookingIndex !== -1) {
        bookings.splice(bookingIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
    }
});

// Handle errors
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
    next();
});

// Catch-all route for handling 404 errors
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
