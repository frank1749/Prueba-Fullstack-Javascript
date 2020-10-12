const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// read won games
app.get('/won-games', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getWonGames();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// read won games
app.get('/all-games', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllGames();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// create game
app.post('/insert-game', (request, response) => {
    const { name } = request.body;
    const { fields } = request.body;
    const { state } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewGame(name, fields, state);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

// update game
app.put('/update-game', (request, response) => {
    const { id, fields, state } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateGameById(id, fields, state);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// delete games
app.post('/delete-game', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.deleteGames();
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));