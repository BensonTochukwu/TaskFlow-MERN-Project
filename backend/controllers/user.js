const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

// DELETE ACCOUNT
const deleteAccount = async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid)
        .select("-password -accessToken");

    if (!deletedUser) {
        throw new BadRequest("User does not exist");
    }

    res
        .status(StatusCodes.OK)
        .clearCookie("auth_token")
        .json({
            message: "Account deleted",
            user: deletedUser
        });
};


// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
    const { username, email, password, profilePicture } = req.body;

    const user = await User.findById(req.params.uid);
    if (!user) {
        throw new BadRequest("You're not allowed to update this user.");
    }

    // -------------------------------
    // USERNAME VALIDATION (FIXED)
    // -------------------------------
    if (username) {
        if (username.length < 3 || username.length > 20) {
            throw new BadRequest("Username must be between 3 to 20 characters.");
        }

        if (!username.match(/^[a-zA-Z0-9_. -]+$/)) {
            throw new BadRequest(
                "Username can only contain letters, numbers, spaces, '_', '-', and '.'"
            );
        }

        if (username.trim().length === 0) {
            throw new BadRequest("Username cannot be empty");
        }
    }

    // -------------------------------
    // PASSWORD VALIDATION (FIXED)
    // -------------------------------
    let hashedPassword;

    if (password) {
        if (password.length < 6) {
            throw new BadRequest("Password must be at least 6 characters");
        }

        if (
            !password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\s@$!%*?&]{6,12}$/
            )
        ) {
            throw new BadRequest(
                "Password must be 6–12 characters and include uppercase, lowercase, number, and special character"
            );
        }

        hashedPassword = await bcrypt.hash(password, 10);
    }

    // -------------------------------
    // SAFE UPDATE OBJECT
    // -------------------------------
    const updateData = {
        username,
        email,
        profilePicture
    };

    if (hashedPassword) {
        updateData.password = hashedPassword;
    }

    const updatedUserProfile = await User.findByIdAndUpdate(
        req.params.uid,
        { $set: updateData },
        { new: true }
    ).select("-password -accessToken");

    res.status(StatusCodes.OK).json(updatedUserProfile);
};

module.exports = {
    deleteAccount,
    updateUserProfile
};