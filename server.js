require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const path = require('path');
const fs = require('fs');

const notesRouter = require('./routes/notes');
const userRouter = require('./routes/user');
const authenticate = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Firebase Admin SDK initialization
let serviceAccount;
const firebaseConfigFileName = 'fridgenotes-9786b-firebase-adminsdk-fbsvc-f3ee5f9de1.json';

// Check if running in a Render-like environment where secret files are mounted
// Render typically mounts secret files to /etc/secrets/
const renderSecretFilePath = path.join('/etc/secrets', firebaseConfigFileName);

if (fs.existsSync(renderSecretFilePath)) {
    // If the file exists at the Render secret path, use it (production environment)
    try {
        const serviceAccountJson = fs.readFileSync(renderSecretFilePath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountJson);
        console.log('Firebase Admin SDK: Loaded credentials from Render secret file.');
    } catch (error) {
        console.error('Firebase Admin SDK: Failed to parse Render secret file:', error);
        process.exit(1); // Exit if critical credentials can't be loaded
    }
} else {
    // Fallback for local development or other environments
    // Assumes the JSON file is in the ./config/ folder for local dev
    const localConfigPath = path.join(__dirname, 'config', firebaseConfigFileName);
    if (fs.existsSync(localConfigPath)) {
        try {
            serviceAccount = require(localConfigPath); // Directly require for local
            console.log('Firebase Admin SDK: Loaded credentials from local config file.');
        } catch (error) {
            console.error('Firebase Admin SDK: Failed to load local config file:', error);
            process.exit(1);
        }
    } else {
        // If the file is not found in either location, it's a critical error
        console.error('Firebase Admin SDK: Service account key file not found in expected locations.');
        console.error('Ensure it is uploaded to Render as a secret file, or present in ./config/ for local dev.');
        process.exit(1);
    }
}

// Initialize Firebase Admin SDK if serviceAccount is loaded
if (serviceAccount) {
    try {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        console.log('Firebase Admin SDK initialized!');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
        process.exit(1);
    }
} else {
    console.error('Firebase Admin SDK: Service account credentials are null. Initialization skipped.');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// health check endpoint
app.get('/healthz', (req, res) => { res.status(200).send('OK') });

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// testing route
app.get('/', (req, res) => {
    res.send('Welcome to the FridgeNotes API!');
});

|app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/notes', authenticate, notesRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});