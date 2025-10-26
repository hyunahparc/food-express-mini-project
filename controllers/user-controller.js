// Import the User model
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");


// REGISTER
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check for duplicate email
        const existingEmail = await User.findOne({ email: email });
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        // Create a new User object
        // (Password hashing is automatically handled by the pre-save hook in user-model)
        const user = new User({ username: username, email: email, password: password, role: role });
        // Save to the database
        // Mongoose automatically runs the pre('save') middleware defined in user-model.js
        const savedUser = await user.save();
        // Respond with user data excluding the password
        const { password: _, ...userData } = savedUser.toObject();
        res.status(201).json({
            message: "User registered successfully",
            user: userData,
        });
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
const update = async (req, res) => {
    try {
        const userId = req.user.id; // Get own ID from the token
        const { username, password } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Apply updated fields
        if (username) user.username = username;
        if (password) user.password = password; /// Automatically hashed by pre('save') hook

        // Save to the database (pre-save hook runs automatically)
        const savedUser = await user.save();

        // Respond with user data excluding the password
        const { password: _, ...userData } = savedUser.toObject();
        res.status(200).json({
            message: "User information updated successfully",
            user: userData,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
const remove = async (req, res) => {
    try {
        const userId = req.user.id; // Get own ID from the token

        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser) {
            return res.status(404).json({ message: "User not found"});
        }
        
        res.status(200).json({ message: "Account deleted successfully"});
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

/////////// ADMIN ONLY //////////

// GETALL USER (Admin only)
const getAll = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            message: "All users fetched successfully",
            total: users.length,
            users,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE USER (Admin only) - username, role
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to be updated
        const { username, role } = req.body;

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(username) user.username = username;
        if(role) user.role = role;

        // Save to the database
        const updatedUser = await user.save();
        // Respond with user data excluding the password
        const { password: _, ...userData } = updatedUser.toObject();
        res.status(200).json({
            message: "User updated successfully (by admin)",
            user: userData,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE USER (Admin only)
const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully (by admin)" });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    register,
    update,
    remove,
    getAll,
    updateUserByAdmin,
    deleteUserByAdmin,
}