const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('../app/Utils/AppError');
const GlobalErrorHandler = require('../app/Http/Controllers/ErrorController');
const tourRouter = require('./../routes/tourRoutes');
const userRouter = require('./../routes/userRoutes');
const reviewRouter = require('./../routes/reviewRoutes');

const app = express();

// GLOBAL MIDDLEWARES
// CREATING A MIDDLEWARE (ACCEPTS 3 PARAMETERS AND MUST CALL THE NEXT FUNCTION)

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.APP_STATE === 'development') app.use(morgan('dev'));

// Limit requests from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 3600 * 1000,
    message: 'Too many requests, please try again after 1hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// Serve static files
app.use(express.static(`${__dirname}/public`))

// Test middleware
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
app.use('/api/v1/reviews', reviewRouter);


//MIDDLEWARE TO HANDLE IF A ROUTE IS NOT FOUND
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//ERROR HANDLING MIDDLEWARE
app.use(GlobalErrorHandler);

module.exports = app;
