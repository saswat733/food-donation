const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organizationName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
}, { timestamps: true });

const Ngo = mongoose.model('Ngo', ngoSchema);
module.exports = Ngo;
