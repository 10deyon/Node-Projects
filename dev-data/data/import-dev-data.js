const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../app/Models/TourModel');
const User = require('./../../app/Models/UserModel');
const Review = require('./../../app/Models/ReviewModel');


dotenv.config({ path: './config.env' });

const DB = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASSWORD);


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,   
}).then(() => {console.log('successfully connected');})

// const connectDB = async () => {
//     try {
//         await mongoose.connect(DB, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useFindAndModify: false,
//             useUnifiedTopology: true,
//         })
//         console.log('successfully connected');
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1);
//     }
// }
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("successful");
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

//DELETE DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("deleted");
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData()
}

console.log(process.argv);