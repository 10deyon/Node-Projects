const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./Services/AppError');
const GlobalErrorHandler = require('./controller/ErrorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes')

const app = express();

//CREATING A MIDDLEWARE (ACCEPTS 3 PARAMETERS AND MUST CALL THE NEXT FUNCTION)
if (process.env.APP_STATE === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//ROUTES
app.get('/', (req, res) => {
    res.send('app');
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//MIDDLEWARE TO HANDLE IF A ROUTE IS NOT FOUND
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//ERROR HANDLING MIDDLEWARE
app.use(GlobalErrorHandler);

module.exports = app;
