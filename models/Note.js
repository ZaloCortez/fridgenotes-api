const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        default: ''
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: null
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    customFields: {
        type: Map,
        of: String
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);