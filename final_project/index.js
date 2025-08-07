const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

// For Axios Demo
const books_routes = require('./router/refbooksdb.js').booksroute;

const app = express();
app.use(express.json());

// Session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Auth middleware for protected customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Route not found handler for /customer
app.get("/customer", (req, res) => {
    res.status(400).json({ message: "Please specify a valid customer route (e.g. /customer/auth/...)" });
});

// Route not found handler for /customer/auth
app.get("/customer/auth", (req, res) => {
    res.status(400).json({ message: "Please specify a valid authenticated route (e.g. /customer/auth/profile)" });
});

// Actual route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Axios Demo
app.use("/books", books_routes);

// Catch-all route for unknown paths
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
