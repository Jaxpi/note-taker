// Adds requirements
const express = require('express');
const path = require('path');

// runs express and calls it app
const app = express();
// every server opens a "socket" on a port, and only one can run on a aport at a time
const PORT = 3001;

// middleware to take entering requests and check to see if url matches file in public folder (where all your static files "live") - this goes above any routes
app.use(express.static('public'));

// Route defines what we want to respond to (homepage in this case), callback function handles logic of route (req, res is always there)
app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/send', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/sendFile.html'))
);

app.get('/routes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/routes.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

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