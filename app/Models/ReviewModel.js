const mongoose = require('mongoose');
const slugify = require('slugify');

//NB: This uses the parent referencing related to the user and the tour

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		review: [true, 'Review cannot be empty'],
	},

	rating: {
		type: String,
		min: 1,
		max: 5
	},

    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },

    tour: {
    	type: mongoose.Schema.ObjectId,
    	ref: 'Tour',
    	required: [true, 'A review must belong to a tour']
    },

    user: {
    	type: mongoose.Schema.ObjectId,
    	ref: 'User',
    	required: [true, 'A review must belong to a user']
    }
},
//These properties helps in making some fields not present on the DB
//i.e properties calculated on the model to be included in the return data
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

// to avoid duplicate data entry for user and data
reviewSchema.index({ tour: 1, user: 1}, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // }).populate({
    //     path: 'tour',
    //     select: 'name'
    // });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
}

//YOU CAN USE NEXT() WHEN USING THE PRE MIDDLEWARE BUT NOT SAME FOR POST
reviewSchema.post('save', function() {
    //this.constructor runs the current review instance
    this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndDelete
//findByIdAndUpdate
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.review = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.review.constructor.calcAverageRatings(this.review.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
