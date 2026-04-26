const { BadRequest, UnauthenticatedError } = require('../errors');
const User = require('../models/Users');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 2 * 24 * 60 * 60 * 1000
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new BadRequest("Username, Email, and Password must be provided!");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequest("Invalid email format");
  }

  if (password.length < 6) {
    throw new BadRequest("Password must be at least 6 characters long");
  }

  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username }),
  ]);

  if (existingEmail) {
    throw new BadRequest("Email already exists");
  }

  if (existingUsername) {
    throw new BadRequest("Username already exists");
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPwd,
  });

  res.status(StatusCodes.CREATED).json({
    username: newUser.username,
    email: newUser.email,
    message: "User registered successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Email and Password both are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials!');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password is not correct');
  }

  const token = await user.jwtCreate();

  user.accessToken = token;
  await user.save();

  const userInfo = await User.findOne({ email }).select("-password -accessToken");

  res
    .status(StatusCodes.OK)
    .cookie('auth_token', token, cookieOptions)
    .json(userInfo);
};

const googleAuth = async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPwd = await bcrypt.hash(generatePassword, 10);

    user = await User.create({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPwd,
      profilePicture: googlePhotoUrl
    });
  }

  const token = await user.jwtCreate();

  user.accessToken = token;
  await user.save();

  const userInfo = await User.findOne({ email }).select("-password -accessToken");

  res
    .status(StatusCodes.OK)
    .cookie('auth_token', token, cookieOptions)
    .json(userInfo);
};

const logout = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .clearCookie('auth_token', cookieOptions)
    .json({ msg: "You are successfully logged out" });
};

module.exports = {
  register,
  login,
  googleAuth,
  logout
};