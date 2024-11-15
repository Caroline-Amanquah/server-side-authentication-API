// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referenceNumber: { type: String, required: true, unique: true },
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Password validation method
UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Explicitly specify the collection name as 'authusers'
const User = mongoose.model('User', UserSchema, 'authusers');

module.exports = User;
