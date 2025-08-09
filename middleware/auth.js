const admin = require('firebase-admin');

const authenticate = async (req, res, next) => {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

    if (!idToken) return res.status(401).json({ message: 'No authentication token provided. Access denied.' });

    try {

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = { uid: decodedToken.uid };
        next();

    } catch (error) {

        console.error('Error verifying Firebase ID token:', error);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
        } else if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
            return res.status(401).json({ message: 'Invalid authentication token. Access denied.' });
        }

        res.status(500).json({ message: 'Internal server error during authentication.' });
    }
};

module.exports = authenticate;