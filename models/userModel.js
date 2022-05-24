const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be filled'],
        unique: true,
        minlength: 4
    },
    email: {
        type: String,
        required: [true, 'Invalid mail'],
        validate: [validator.isEmail, 'Please provide valid email'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password must be filled'],
        minlength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation
                return val === this.password;
            },
            message: 'Confirm: ({VALUE})  must be same ad s password'
        },
        required: [true, 'Confirm:  must be same ad s password']
    },
    passwordConfirmedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: Date,
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordConfirmedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    //False means not changed
    return false;
};


userSchema.pre(/^find/, function(next) {
    //this points to current query
    this.find({ active: { $ne: false } });
    next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
