const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'Tour name must not be greater than 40 characters'],
        minLength: [10, 'Tour name must not be lesser than 10 characters'],
        // validate: [ validator.isAlpha, 'name must be alphabets' ]
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a name'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['difficult', 'medium', 'easy'],
            message: 'Difficulty must be either: easy, medium or dificult'
        },
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        maxLength: [5, 'ratings must not be greater than 5 characters'],
        minLength: [1, 'ratings must not be lesser than 1 characters']
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    priceDiscount: {
        type: Number,
        validate: {
            message: 'discount price ({VALUE}) should be below regular price',
            validator: function (val) {
                return val > this.price;
            }
        }
    },
    summary: {
        type: String,
        trim: true
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

//NB: When you want to use #this, always use the normal function and arrow function
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7
});

//FOLLOWING CODE IS ABOUT MIDDLEWARE, IT IS ALWAYS A pre() AND post() OPETATION
//NB: DOCUMENT MIDDLEWARE: runs before .save() and .create() but not others

//PRE-SAVE-HOOK
tourSchema.pre('save', function(next) {
    //this is used to create a slug in the list of object to be created on DB
    this.slug = slugify(this.name, { lower: true  });
    next();
});

// tourSchema.pre('save', function(next) {
//     //this is used to create a slug in the list of object to be created on DB
//     console.log('about to write');
//     next();
// });

// //A post hook always have access to doc and not this
// tourSchema.post('save', function(doc, next) {
//     //this is used to create a slug in the list of object to be created on DB
//     console.log(doc)
//     next();
// });


//QUERY MIDDLEWARE
tourSchema.pre('/^find/', function(next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post('/^find/', function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});


//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

tourSchema.post('aggregate', function(docs, next) {
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;