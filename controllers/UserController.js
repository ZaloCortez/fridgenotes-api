const User = require('../models/User');

exports.createUserProfile = async (req, res) => {
    try {
        const { firebaseUid, email } = req.body;
        if (!firebaseUid || !email) return res.status(400).json({ message: 'Firebase UID and email are required for user profile creation.' });
        let user = await User.findOne({ firebaseUid: firebaseUid });
        if (user) return res.status(200).json({ message: 'User profile already exists.', user: user });

        user = new User({
            firebaseUid: firebaseUid,
            email: email,
            role: 'user'
        });

        await user.save();
        res.status(201).json({ message: 'User profile created successfully.', user: user });
    } catch (error) {
        console.error('Error creating user profile in DB:', error);
        if (error.code === 11000) return res.status(409).json({ message: 'User with this email or firebase UID already exists.' });
        res.status(500).json({ message: 'Internal server error during user profile creation.', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid: firebaseUid });
        if (!user) return res.status(404).json({ message: 'User profile not found in database.' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};