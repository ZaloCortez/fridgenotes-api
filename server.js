require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const notesRouter = require('./routes/notes');
const userRouter = require('./routes/user');
const authenticate = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// firebase sdk initialization
try {
    const serviceAccount = require('./config/fridgenotes-9786b-firebase-adminsdk-fbsvc-f3ee5f9de1.json');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('firebase admin SDK initialized');
} catch (error) {
    console.error('failed to initialize firebase admin SDK:', error);
    process.exit(1);
}

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// testing route
app.get('/', (req, res) => {
    res.send('Welcome to the FridgeNotes API!');
});

app.use('/api/notes', authenticate, notesRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});