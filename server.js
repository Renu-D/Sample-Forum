//import path from 'rootpath';
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('controllers/jwt');
const errorHandler = require('controllers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//for cross domain purpose
app.use(cors());

// use JWT auth to secure the api
//this wont allow unauthorized users
app.use(jwt());

// api routes
app.get("/", (req, res) => {
    res.json({ status: "success", message: "Welcome To Testing API" });
});
app.use('/api/users', require('./users/controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4200;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
module.exports=app;