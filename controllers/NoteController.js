const Note = require('../models/Note');

exports.createNote = async (req, res) => {
    try {
        const userId = req.user.uid;

        const {
            title,
            content,
            position,
            dueDate,
            priority,
            customFields
        } = req.body;

        if (!title || !position || typeof position.x === 'undefined' || typeof position.y === 'undefined') {
            return res.status(400).json({ message: 'Title and position (x, y) are required.' });
        }

        const newNote = new Note({
            title,
            content,
            position,
            dueDate,
            priority,
            customFields: customFields || {},
            userId
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);

    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const { userId } = req.user.uid;
        const notes = await Note.find({ userId: userId });
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
}

exports.getNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const note = await Note.findOne({ _id: id, userId: userId });

        if (!note) return res.status(404).json({ message: 'Note not found' });

        res.status(200).json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
}

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const updates = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: userId },
            updates,
            { new: true, runValidators: true }
        )

        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
}

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

        res.status(200).json({ message: 'Note deleted successfully.' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error:', error: error.message });
    }
}