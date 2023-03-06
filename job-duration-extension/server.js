require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 8080;

var express = require('express')
  , backend = require('./backend/src');

const app = express();

app.use(backend.initialize());

// Deliver static files as frontend

app.use('/configure', express.static(__dirname + '/configure'));
app.use('/configure-popup', express.static(__dirname + '/configure-popup'));
app.use(express.static(__dirname + '/frontend'));
app.use('/', express.static('frontend/src/'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));