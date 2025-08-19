const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  countryCode: { type: String },
  serviceUse: { type: String },
  jobTitle: { type: String },
  hasExperience: { type: Boolean },
  companyName: { type: String },
  businessArea: { type: String },
  teamSize: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);