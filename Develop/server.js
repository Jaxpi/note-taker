// Adds requirements
const express = require('express');
const path = require('path');
const fs = require("fs");

// This runs express and calls it app
const app = express();

// This delcares the port for the server - every server opens a "socket" on a port, and only one can run on a aport at a time
const PORT = 3001;
const allNotes = require('./db/db.json');

// These are middleware to take entering requests and check to see if url matches file in public folder (where all your static files "live") - this goes above any routes
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// These functions instruct where to get the requested data from and where to send the responses - index.html for the intial homepage and notes.html for the note creator and stored list of notes - the * is so if something other than those options is input it goes to index.html
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// This is how the new note gets created and stored in db.json
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// This provides instructions to take the new note information and create a new note element
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

// This instructs to remove the note information from the display and from the db.json
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// This allows the port to listen for requests from users
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// npm i (to install requirements)
// npm i -D nodemon (to install nodemon) - after this you have to go into package.json and add/verify the following:
  // "scripts": {
  //   "start": "node server",
  //   "watch": "nodemon server"
  // },
  // "devDependencies": {
  //   "nodemon": "^2.0.20"
  // }
// npm run watch