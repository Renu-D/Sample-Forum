const config = require('../config/config.json');
const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI || config.connectionString;
if(config.testing === 'stop') {
    mongoose.connect(DB_URI, { useCreateIndex: true, useNewUrlParser: true });
}
else if (config.testing === 'start'){
    mongoose.connect("mongodb://localhost/NodeJS-API-TEST", { useCreateIndex: true, useNewUrlParser: true });
}
mongoose.Promise = global.Promise;
var models = require('../users/model');

module.exports = {
    User: models.User,
    Post: models.Post,
    Comment: models.Comment
};