// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'manager', 'agent', 'merchant', 'staff', 'viewer', 'new'],
            default: 'viewer',
        },
        // This links a 'merchant' user to their stores
        stores: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
        }],
    }, 
    { timestamps: true }
);

// --- Mongoose Middleware ---

// Pre-save hook to hash password
// Hash password before saving the user
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error)
    }
});

// --- Mongoose Methods ---

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);