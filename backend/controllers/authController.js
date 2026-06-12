const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

// POST /api/auth/signup
const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    dateOfBirth,
    gender,
    address,
  } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }
  console.log("req herer")
  const verificationToken = generateVerificationToken();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    dateOfBirth,
    gender,
    address,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpiry: verificationTokenExpiry,
  });

  await sendVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message: 'Account created. Please check your email to verify your account.',
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

// GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationTokenExpiry');

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or expired verification token' });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  const jwtToken = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    token: jwtToken,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '+emailVerificationToken +emailVerificationTokenExpiry'
  );

  if (!user) {
    // Don't leak whether the email exists
    return res.status(200).json({
      success: true,
      message: 'If that email exists and is unverified, a new link has been sent.',
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Email is already verified' });
  }

  const verificationToken = generateVerificationToken();
  user.emailVerificationToken = verificationToken;
  user.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, verificationToken);

  res.status(200).json({ success: true, message: 'Verification email resent' });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isEmailVerified) {
    return res
      .status(403)
      .json({ success: false, message: 'Please verify your email before logging in' });
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
};

module.exports = { signup, verifyEmail, resendVerification, login, getMe };
