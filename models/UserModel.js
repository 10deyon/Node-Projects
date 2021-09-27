const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'enter a name for this user'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'enter a valid email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'please provide a valid email']
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'password field is required'],
            minLength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'confirm your password'],
            // THIS ONLY WORKS ON SAVE AND CREATE
            validate: {
                validator: function (val) {
                    return val === this.password;
                },
                message: 'password does not match',
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    }
);

userSchema.pre('save', async function(next) {
    // Run this if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete passwordConfirm with the cost of 12 
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
