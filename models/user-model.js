const mongoose = require("mongoose");
// hashed password : use bcrypt
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    role: {
        type: String, 
        enum: ["user", "admin"],
        required: true,
    }
});

// Handle password hashing (runs before saving to DB)
// "Convert the user's password to a hash before saving."
// This part could be moved to a separate middleware later
userSchema.pre("save", async function(next) {
    // Skip if password hasn't been modified (prevents double hashing on update)
    if(!this.isModified("password")) return next();

    try {
        // Generate salt (random string) with complexity 10
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        // Proceed to next step (actually save the hashed password)
        next();
    } catch(err) {
        next(err);
    }
});

// Password verification method (used during login)
userSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};


// Create the User model and connect it to the collection
const User = mongoose.model("User", userSchema);



module.exports = User;