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

// These functions instruct that when a clinet requests -api/notes to respond with the allNotes in position 1 of the array, -the homepage or any other request (not homepage, api/notes, or /notes) (indicated by the *) to respond with the index.html file, -/notes to respond with the notes.html file
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

// This is how the new note gets created and stored in db.json (body is the request, notesArray is the response)
function createNewNote(body, notesArray) {
    // Assigns the body request to newNote
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


// NOTES
// AS A small business owner I WANT to be able to write and save notes SO THAT I can organize my thoughts and keep track of tasks I need to complete

// GIVEN a note-taking application
// WHEN I open the Note Taker // THEN I am presented with a landing page with a link to a notes page // WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text // THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon // THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column // THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page // THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

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