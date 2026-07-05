const jwt = require('jsonwebtoken');

/**
 * authArtist — must be logged in AND have role=artist
 */
const authArtist = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: 'Only artists can do this' });
        }
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

/**
 * authUser — must be logged in (any role: user OR artist)
 */
const authUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Accept both 'user' and 'artist' roles
        if (!['user', 'artist'].includes(decoded.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { authArtist, authUser };