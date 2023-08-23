const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/loteriasDB';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
    console.log('Mongoose conectado a ' + dbURI);
});

module.exports = mongoose;