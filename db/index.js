const mongoose = require('mongoose');
require('dotenv').config();

const uirDb = process.env.DB_HOST;

const db = mongoose.connect(uirDb, {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.connection.on('connected', err => {
    console.log(`"Database connection successful"`);
});

mongoose.connection.on('error', err => {
    console.log(`Database connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', err => {
    console.log(`Database disconnected`);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Connection for DB disconnected and app terminated');
        process.exit(1);
    });
});
module.exports = db;
