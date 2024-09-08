const uuid = require("./helpers/uuid")

const fs = require('fs')
// Import Express.js
const express = require('express');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001

// Static middleware pointing to the public folder
app.use(express.static('public'));

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
//app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'db/db.json'))
);

app.post('/api/notes', (req, res) => {

    console.log ("x: ", req.body)
    // Log that a POST request was received
    //console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    //const { product, review, username } = req.body;
  
    // If all the required properties are present
    //if (product && review && username) {
      // Variable for the object we will save
      //const newReview = {
        //product,
        //review,
        //username,
        //review_id: uuid(),
      //};
  
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {

        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
          console.log(parsedNotes)
  
          // Add a new review
        //   parsedReviews.push(newReview);
            const newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uuid()
            }
            parsedNotes.push(newNote);
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).json('Error in creating note');
                    return
                }

                console.info('Successfully updated reviews!')
                res.status(201).json({message:"I received", data:parsedNotes});
            });
        
        }
    })
  
//       const response = {
//         status: 'success',
//         body: newReview,
//       };
  
//       console.log(response);
    //    res.status(201).json({message:"I received", data:newNote});
//     } else {//
//       res.status(500).json('Error in posting review');
//     }
  });

  app.delete('/api/notes/:id', (req, res) =>{
    // 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {

        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
        //   console.log(parsedNotes)
  
          for(let i = 0; i < parsedNotes.length;i++)  {
            if (parsedNotes[i].id === req.params.id){
                parsedNotes.splice(i, 1)
            }
          }
          console.log(parsedNotes)
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).json('Error in creating note');
                    return
                }

                console.info('Successfully updated reviews!')
                res.status(201).json({message:"I received", data:parsedNotes});
            });
        // res.json(req.params.username)
        }
    })

  }) 

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

