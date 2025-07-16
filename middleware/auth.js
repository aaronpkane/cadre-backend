const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify Token
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user; // {id, role}
        next();
    });
}

// Role-based Authorization
function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };
