const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        if (process.env.NODE_ENV !== 'production' && token.replace('Bearer ', '') === 'mock-token') {
            req.user = { id: 1, type: 'admin', name: 'Dev Admin' };
            return next();
        }
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.type !== role) {
            return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
