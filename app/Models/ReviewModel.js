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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
