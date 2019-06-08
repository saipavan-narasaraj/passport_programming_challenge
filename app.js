const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const logger = require('morgan');
const rateLimit = require("express-rate-limit");

/* 
    Prevent Denial-of-service attack
*/
const port = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
});

/* 
    requiring routes files.
*/
const homePage = require('./routes/homePage');
const getFactories = require('./routes/getFactories');
const createFactory = require('./routes/createFactory');
const deleteFactory = require('./routes/deleteFactory');
const updateFactory = require('./routes/updateFactory');
const jsonSchemaValidator = require('./helpers/jsonSchemaValidator');

/* 
    MongoDB connection through Mongoose. 
*/
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/* 
   use the below for connection local MongoDB .
*/
// mongoose.connect('mongodb://localhost:27017/passportProgrammingChallenge')

/* 
   use the below for connection mLab MongoDB .
*/
mongoose.connect('mongodb+srv://admin:admin@cluster0-eifgw.mongodb.net/test?retryWrites=true&w=majority')
    .catch((err) => console.error('error connecting to mongo', err));

app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
io.on('connection', function (socket) {
    console.log('a user connected');
});

/* 
    Mapping socket.io to request as a parameter. 
*/
app.use(function (req, res, next) {
    req.io = io;
    next();
})

/* 
    API's to handle requests. jsonSchemaValidator is used to validate POST and PUT request body.
*/
app.get('/', homePage);
app.get('/getFactories', getFactories);
app.delete('/deleteFactory/:name', deleteFactory);
app.use(jsonSchemaValidator)
app.post('/createFactory', createFactory);
app.put('/updateFactory/:name', updateFactory);


http.listen(port);

module.exports = app
