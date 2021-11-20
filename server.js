const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./index');

const DB = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
    .connect(DB, {
    // mongoose.connect(process.env.DB_CONN_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {console.log('successfully connected');})

//SERVER
const port = process.env.APP_PORT || 3001;
const server = app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION WARNING');
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION WARNING');
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', err => {
    console.log('SIGTERM RECEIVED. shutting down');
    server.close(() => {
        console.log("process terminated");
        process.exit(1);
    });
});
