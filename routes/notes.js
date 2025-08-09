const express = require('express');
const router = express.Router();

const NoteController = require('../controllers/NoteController');

router.post('/', NoteController.createNote);
router.get('/', NoteController.getNotes); // get all the user's notes.
router.get('/:id', NoteController.getNote); // get an individual note by id.
router.put('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

module.exports = router;