// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const connection = require('./connection');
const { response, request } = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
    response.status(200).json({ message: "Hello World!" })
});

app.post('/bookmarks', (request, response) => {
    const { url, title } = request.body;
    if (!url || !title) {
        return response.status(422).json({ error: 'required field missing' });
    }
    connection.query('INSERT INTO bookmark SET ?', request.body, (err, stats) => {
        if (err) return response.status(500).json({ error: err.message, sql: err.sql });

        connection.query('SELECT * FROM bookmark WHERE id = ?', stats.insertId, (err, records) => {
            if (err) return response.status(500).json({ error: err.message, sql: err.sql });
            return response.status(201).json(records[0]);
        });
    });
});

app.get('/bookmarks/:id', (request, response)=>{
    connection.query('SELECT * FROM bookmarks WHERE id=?', [request.params.id], (err, results)=>{
        if(err){
            return response.status(404).send({error: 'Bookmark not found'})
        }else{
            return response.status(200).send(results);
        }
    })
})
module.exports = app;
